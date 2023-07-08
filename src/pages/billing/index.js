import withAuth from "@/HOCS/withAuth";
import { packages } from "@/configs";
import React from "react";
import { useCookies } from "react-cookie";

function index() {
  const [cookies, setCookie, removeCookie] = useCookies(['my-cookie']);

  const handlePayment= (pack) =>{
    fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(pack)
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res.session);
      window.location.href = res.session.url
      setCookie('st-client-id',res.session.id)
    })
  }
  return (
    <>
     <div className="text-center mt-10">
        <h1 className="text-3xl sm:text-5xl font-semibold">Membership</h1>
      </div>
      <div className="py-10 flex flex-wrap mx-10 justify-center gap-7">
      {packages.map((pack, i) => {
        return (
          <div key={pack.name+i} className=" bg-gray-950 p-5 rounded-md">
            <h1 className="text-2xl font-bold mb-7">{pack.name}</h1>
            <ul>
              {
                pack.services.map((service, ii)=>{
                  return (
                    <li className="mt-1" key={service+i}>- {service}</li>
                  )
                })
              }
            </ul>
            <div className="flex items-end gap-2 my-7">
              <h1 className="text-3xl font-semibold">${pack.price}</h1>
              <span> per month</span>
            </div>
            <div className="flex justify-center" onClick={()=>handlePayment(pack)}>
              <button className=" w-full bg-indigo-700 rounded-2xl text-sm font-semibold px-3 py-1">
                Subscribe
              </button>
            </div>
          </div>
        );
      })}
    </div>
    </>
    
  );
}

export default withAuth(index);
