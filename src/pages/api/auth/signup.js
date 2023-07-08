import dbConnect from "@/libs/dbConnect";
import UserModel from "@/models/UserModel";
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


export default async function signup(req, res){
  if(req.method=='POST'){
    await dbConnect()
    const {name, email, password} = req.body
    const hashedPass = bcrypt.hashSync(password, salt);
    const user = new UserModel({
      name, email, password:hashedPass
    })
    user.save()
    .then(()=>{
      res.send({status:'ok'})
    })
  }
}