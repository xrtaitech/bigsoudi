import React, { useEffect } from 'react'

function cancel() {
 setTimeout(()=>{
  window.location.href = "/billing"
 },1000)
  return (
    <div className=" h-[50vh] flex justify-center items-center">
      <h1 className="text-5xl leading-normal font-bold text-center text-red-500">
        Payment Cancelled
      </h1>
    </div>
  )
}

export default cancel