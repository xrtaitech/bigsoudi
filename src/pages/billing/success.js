import React, { useEffect } from "react";
function success() {
  useEffect(() => {
    fetch("/api/payment/verify")
      .then((res) => res.json())
      .then((res) => {
        console.log(res.status);
        if (res.status == "already credited" || res.status == "credited") {
          window.location.href = "/";
        }
        if (res.status == "not paid") {
          window.location.href = res.url;
        }
      });
  }, []);
  return (
    <div className=" h-[50vh] flex justify-center items-center">
      <h1 className="text-5xl leading-normal font-bold text-center text-green-600">
        Payment Successfull
      </h1>
    </div>
  );
}

export default success;
