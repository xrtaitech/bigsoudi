import dbConnect from "@/libs/dbConnect"
import UserModel from "@/models/UserModel"

export default async function handler(req, res) {
  if(req.method=="GET"){
   try{
    await dbConnect()
    const email = req.cookies.email
    const user = await UserModel.findOne({email}).select({_id:0, password:0})
    res.send({status:'ok', user})
   }catch(err){
    console.log(err);
   }
  }
} 