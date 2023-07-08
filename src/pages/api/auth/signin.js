import dbConnect from "@/libs/dbConnect";
import {createJwtToken} from "@/libs/jwt";
import UserModel from "@/models/UserModel";
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


export default async function signin(req, res){
  if(req.method=='POST'){
    await dbConnect()
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    const hash = user.password
    const isMatched = bcrypt.compareSync(password, hash);
    const jwtToken = createJwtToken({email, name:user.name, id: user._id})
    res.send({status:'ok', token: jwtToken, name:user.name, email: user.email})
  }
}