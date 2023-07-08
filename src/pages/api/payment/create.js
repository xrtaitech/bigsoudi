require('dotenv').config()
import { SERVER, STRIPE_PRIVATE_KEY } from "@/configs";

const stripe = require('stripe')(STRIPE_PRIVATE_KEY)


export default async function handler(req, res){
  const {name, price, services} = req.body
  if(req.method == 'POST'){
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              description:  services.join('\n')
            },
            unit_amount: 100 * price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: SERVER+'/billing/success',
      cancel_url: SERVER+'/billing/cancel',
    });

     res.send({status:'ok', session})
  }
  
}



