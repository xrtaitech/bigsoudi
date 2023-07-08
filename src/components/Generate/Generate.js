import React, { useContext, useEffect, useRef, useState } from "react";
import styles from './generate.module.css'
import { dimensions } from "@/configs";
import { MyContext } from "@/pages/_app";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Generate() {
  const [negativePrompt, setNegativePrompt] = useState('')
  const [prompt, setPrompt] = useState('')
  const {inprogress, setInprogress, setGeneratedImage, dimension, setDimension, sample, setSample} = useContext(MyContext)
  
  const range1 = useRef('range1')
  const range2 = useRef('range2')
  if(range1.current.style){
    const percentage = (100/(dimensions.length-1))*(dimension)
    range1.current.style.background = `linear-gradient(to right, #373296 0%, #373296 ${percentage}%, #fff ${percentage}%, white 100%)`
  }
  if(range2.current.style){
    const percentage = 33*(sample-1)
    range2.current.style.background = `linear-gradient(to right, #373296 0%, #373296 ${percentage}%, #fff ${percentage}%, white 100%)`
  }

  const generateImage = () =>{
    const server = window.location.origin
    setInprogress(true)
    setPrompt('')
    setNegativePrompt('')
    const data = {
      sample, prompt, negativePrompt,
      dimension: {
        width: dimensions[dimension].width,
        height: dimensions[dimension].height
      }
    }
    fetch(server+'/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      }, 
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(result=>{
      const {id, meta, output} = result
      if(output){
        setGeneratedImage({id, meta, output})
      }else{
        toast(result.message);
        setTimeout(()=>{
          window.location.href="/billing"
        },2000)
      }
      setInprogress(false)
    })
    .catch(err=>{
      setInprogress(false)
      console.log(err);
    })
  }
  return (
    <>
    <div className=" flex flex-col-reverse sm:flex-row gap-10 w-[90%] m-auto py-10">
      {/* Generate Part  */}
      <div className="w-full">
        <div>
          <div>
            <label className="opacity-60 text-sm" htmlFor="describe">Describe your image</label>
          </div>
          <textarea
            className=" mt-1 mb-4 shadow overflow-y-hidden w-full bg-zinc-700 bg-opacity-60 border border-zinc-700 rounded-xl leading-relaxed text-sm px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-700 placeholder:opacity-50 min-h-[130px]"
            id="describe"
            placeholder="A beautiful girl"
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
          />
        </div>
        <div>
          <div>
            <label className="opacity-60 text-sm" htmlFor="negative">Negative Prompt (optional)</label>
          </div>
          <textarea
            className="mt-1 shadow overflow-y-hidden w-full bg-zinc-700 bg-opacity-60 border border-zinc-700 rounded-xl leading-relaxed text-sm px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-700 placeholder:opacity-50 h-[40px]"
            id="negative"
            placeholder="text, blurry"
            value={negativePrompt}
            onChange={e=>setNegativePrompt(e.target.value)}
          />
        </div>
        <div>
          <button 
            className="bg-indigo-700 rounded-xl px-5 py-1 text-sm font-semibold mt-3 float-right disabled:bg-slate-400"
            disabled={prompt.length < 1}
            onClick={generateImage}
          >
            Generate
          </button>
        </div>
      </div>

      {/* Settings Part  */}
      <div className="w-full sm:w-2/6  ring-1 ring-zinc-700 p-5 rounded-xl mt-7 h-full">
        <div >
          <label htmlFor="dimension" className="opacity-60" > Dimensions </label>
          <input id="dimension" ref={range1} type="range" min="0" max={dimensions.length-1} value={dimension} 
            className={`${styles.slider} `}
            onChange={e=>setDimension(e.target.value)}
          />
          <p className="text-center">{dimensions[dimension].width} x {dimensions[dimension].height}</p>
        </div>
        <div >
          <label htmlFor="sample" className="opacity-60" > Samples </label>
          <input id="sample" ref={range2} type="range" min="1" max="4" value={sample} 
            className={`${styles.slider} ${styles.slider2} `}
            onChange={e=>setSample(e.target.value)}
          />
          <p className="text-center">{sample}</p>
        </div>
      </div>
    </div>
    <ToastContainer position="bottom-right" />
    </>
  );
}

export default Generate;
