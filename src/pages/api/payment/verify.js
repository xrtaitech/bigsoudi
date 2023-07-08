import { STRIPE_PRIVATE_KEY } from "@/configs";
import dbConnect from "@/libs/dbConnect";
import UserModel from "@/models/UserModel";

const stripe = require("stripe")(STRIPE_PRIVATE_KEY);

export default async function handler(req, res) {
  if (req.method == "GET") {
    const clientId = req.cookies['st-client-id']
    const retrive = await stripe.checkout.sessions.retrieve(clientId);
    if (retrive.payment_intent) {
      const retriveIntent = await stripe.paymentIntents.retrieve(
        retrive.payment_intent
      );
      if (retriveIntent.metadata.isCredited) {
        res.send({status:'already credited'})
      } else {
        //  Todo:  Add credit to the user account
        const email = req.cookies.email
        await dbConnect()
        const user = await UserModel.findOne({email})
        if(user.credit>0){
          user.credit += retrive.amount_total
        }else{
          user.credit = retrive.amount_total
        }

        user.save()
        .then(saved=>{
          console.log(saved);
          console.log('credit added');
          stripe.paymentIntents.update(
            retrive.payment_intent,
            { metadata: { isCredited: true } }
          )
          .then((a)=>{
            console.log('updated and credit added');
            res.send({status:'credited'})
          })
        })
        
      }
    }else{
      res.send({ status: "not paid", url: retrive.url});
    }
    
  }
}
