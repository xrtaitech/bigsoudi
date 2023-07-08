import { STABLEDIFFUSION_KEY } from "@/configs";
import dbConnect from "@/libs/dbConnect";
import UserModel from "@/models/UserModel";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require("dotenv").config();
const axios = require("axios");

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { sample, dimension, prompt, negativePrompt } = req.body;
    const email = req.cookies.email;
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if(user.credit < sample){
      return res.send({status:'nocredit', message: 'Not  enough credit'})
    }
    
    generate({ sample, dimension, prompt, negativePrompt })
      .then(async (result) => {
        user.credit -= sample;
        user
          .save()
          .then((saved) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(req.body);
        console.log(err);
        res.json({ status: "something wrong" });
      });
  }
}

const generate = ({ sample, dimension, prompt, negativePrompt }) => {
  console.log(prompt, 'called');
  return new Promise((resolve, reject) => {
    axios
      .post("https://stablediffusionapi.com/api/v3/text2img", {
        key: STABLEDIFFUSION_KEY,
        prompt: prompt,
        negative_prompt: negativePrompt,
        width: dimension.width,
        height: dimension.height,
        samples: sample,
        num_inference_steps: "20",
        safety_checker: "no",
        enhance_prompt: "no",
        seed: null,
        guidance_scale: 7.5,
        multi_lingual: "no",
        panorama: "no",
        self_attention: "no",
        upscale: "no",
        embeddings_model: "embeddings_model_id",
        webhook: null,
        track_id: null,
      })
      .then((res) => {
        console.log("api called");
        if (res.data.status == "success") {
          console.log("success 1");
          resolve(res.data);
        } else if (res.data.status == "processing") {
          console.log("processing", res.id);
          const interval = setInterval(() => {
            axios
              .post("https://stablediffusionapi.com/api/v4/dreambooth/fetch", {
                key: STABLEDIFFUSION_KEY,
                request_id: res.data.id,
              })
              .then((result) => {
                if (result.data.status == "success") {
                  console.log("success 2");
                  resolve(result.data);
                  clearInterval(interval);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }, 1000);
        } else {
          console.log(res);
          reject(res);
        }
      })
      .catch((err) => {
        console.log(err, "image generate error");
        reject(err);
      });
  });
};
