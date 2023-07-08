import React, { useContext } from 'react'
import Logo from '@/assets/img/logo.svg'
import Image from "next/image"
import Link from "next/link"
import { MyContext } from "@/pages/_app"
function Navbar() {
  const {user:{email}, credit} = useContext(MyContext)
  return (
    <>
    <div className="bg-dark flex justify-between py-4 px-7">
      <div>
        <Link href="/" >
          <Image src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="hidden sm:flex gap-5 ">
          <Link href="/">Home</Link>
          <Link href="/generate">Generate</Link>
          <Link href="/billing">Billing</Link>
      </div>
      <div >
        {
          !email && 
          <Link href="/signin">
          <button className="bg-indigo-700 text-sm font-semibold py-1 px-3 rounded-md">Get Started</button>
        </Link>
        }
        {
          email && 
          <Link href="/account">
          <button className="bg-indigo-700 text-sm font-semibold py-1 px-3 rounded-md">
            Credit : {credit}
          </button>
        </Link>
        }
        
      </div>
      
    </div>
    <div className=" sm:hidden bg-dark flex justify-center py-4 px-7">
      <div className="flex flex-wrap justify-center gap-5 ">
        <Link href="/" as="/">Home</Link>
        <Link href="/generate">Generate</Link>
        <Link href="/billing">Billing</Link>
        </div>
    </div>
    </>
  )
}

export default Navbar