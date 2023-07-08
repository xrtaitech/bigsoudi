import { STABLEDIFFUSION_KEY } from "@/configs";
import dbConnect from "@/libs/dbConnect";
import UserModel from "@/models/UserModel";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require("dotenv").config();
const axios = require("axios");

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { image, meta } = req.body;
    await dbConnect();
    const email = req.cookies.email;
    const user = await UserModel.findOne({ email });
    const sample = meta.n_samples || 1;
    if (user.credit < sample) {
      return res.send({ status: "nocredit", message: "Not  enough credit" });
    }
    generate({ image, meta })
      .then((result) => {
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
        console.log(err);
        console.log(req.body);
        res.send({ status: "something wrong" });
      });
  }
}

const generate = ({ image, meta }) => {
  return new Promise((resolve, reject) => {
    axios
      .post("https://stablediffusionapi.com/api/v3/img2img", {
        key: STABLEDIFFUSION_KEY,
        prompt: meta.prompt || "",
        negative_prompt: meta.negative_prompt,
        init_image: image,
        width: meta.W || "512",
        height: meta.H || "512",
        samples: meta.n_samples || "4",
        num_inference_steps: "30",
        safety_checker: "no",
        enhance_prompt: "no",
        guidance_scale: 0.5,
        strength: 0.5,
        seed: null,
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
