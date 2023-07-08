import Link from "next/link";
import React, { useContext, useState } from 'react'
import { useCookies } from "react-cookie";
import { MyContext } from "./_app";

function Signin() {
  const [cookies, setCookie, removeCookie] = useCookies(['cookie']);
  const [email, setEmail]  = useState('')
  const [password, setPassword]  = useState('')
  const {setUser} = useContext(MyContext)
  const handleSignin = (e) =>{
    e.preventDefault()
    fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    })
    .then(res=>res.json())
    .then(res=>{
      setCookie("token", res.token)
      setCookie("name", res.name)
      setCookie("email", res.email)
      setUser({email: res.email, name: res.name})
      window.location.href = "/generate"
    })
  }
  return (
    <div>
      <form onSubmit={handleSignin} className=" text-slate-950 flex justify-center  ">
       <div className="w-full max-w-[450px] m-10 mt-20 rounded-md gap-2 flex flex-col [&>*]:rounded-sm [&>input]:px-2 [&>input]:py-1 [&>input]:outline-none [&>input]:mb-2  p-7 bg-slate-950">
        <h1 className="text-2xl font-bold text-white text-center mb-5">Signin</h1>
        <label className="text-white" htmlFor="email">Email:</label>
        <input id="email" value={email} onChange={t=>setEmail(t.target.value)} type="email" placeholder="Email" />
        <label className="text-white" htmlFor="pass">Password</label>
        <input id="pass" value={password} onChange={t=>setPassword(t.target.value)} type="password" placeholder="Password" />
        <button className=" bg-indigo-700 text-white px-2 ">Submit</button>
       </div>
      </form>
      <div className="flex justify-center gap-2">
        <p>Don't have an account?</p>
        <p className=" text-indigo-400">
          <Link href="/signup">Signup</Link>
        </p>
      </div>
    </div>
  )
}

export default Signin