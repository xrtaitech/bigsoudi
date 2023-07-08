import { MyContext } from "@/pages/_app";
import Signin from "@/pages/signin";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const withAuth = Component => {
  const Auth = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie']);
    const [isLoggedIn, setIsLoggedIn] = useState("null")
    const {setUser} = useContext(MyContext)
    useEffect(()=>{
      setUser({name:cookies.name, email:cookies.email})
      if(cookies.email){
        setIsLoggedIn(true)
      }
      if(!cookies.email){
        setIsLoggedIn(false)
      }
    },[])
    if(isLoggedIn=="null"){
      return ""
    }
    if (!isLoggedIn) {
      return (
        <Signin />
      );
    }
    return (
      <Component {...props}  />
    );
  };
  return Auth;
};

export default withAuth;