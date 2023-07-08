import Image from "next/image";
import React, { useContext, useState } from "react";
import LoadingGif from '@/assets/img/loading.gif'
import CustomImage from "../CustomImage/CustomImage";
import { MyContext } from "@/pages/_app";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShowImages() {
  const { generatedImage, setGeneratedImage, inprogress, setInprogress } = useContext(MyContext);
  const [variantImages, setVariantImages] = useState({});
  
  const generateVariant = (img) => {
    setInprogress(true);
    const server = window.location.origin;
    const data = {
      image: img,
      meta: generatedImage.meta
    };
    fetch(server + "/api/image-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        const { id, meta, output } = result;
        if(output){
          setGeneratedImage({...generatedImage, output: [...generatedImage.output, ...output]});
        }else if(result.status=="nocredit"){
          toast(result.message)
        }else{
          toast('Something wrong!  Try again..')
        }
        setInprogress(false);
      })
      .catch((err) => {
        setInprogress(false);
        console.log(err);
      });
  };

  return (
    <>
    <div>
      <div className="px-10 flex gap-5 flex-wrap justify-center">
        {!inprogress && generatedImage.output &&
          generatedImage.output.toReversed().map((item, i) => {
            return (
              <div key={i}>
                <CustomImage i={i} image={item} fn={generateVariant} />
               
              </div>
            );
          })}
          {
            inprogress &&
            <div>
              <Image src={LoadingGif} height="200" width="200" />
            </div>
          }
      </div>
     
    </div>
    <ToastContainer position="bottom-right" />
    </>
  );
}

export default ShowImages;
