import React, { useState } from "react";
import BlurImg from "@/assets/img/blur.jpg";
import Image from "next/image";
function CustomImage({ image, fn, i }) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <Image
        className="rounded-sm ring-2 ring-gray-400 bg-gradient-to-r from-slate-400 to-slate-800"
        src={image}
        width={320}
        height={240}
        alt="Picture of the author"
        onLoad={() => setIsLoading(false)}
      />
      {!isLoading && (
        <button
          onClick={() => fn(image)}
          className="mt-2 py-1 rounded-sm bg-indigo-500 text-sm font-bold w-full"
        >
          Variant {i + 1}
        </button>
      )}
    </>
  );
}

export default CustomImage;
