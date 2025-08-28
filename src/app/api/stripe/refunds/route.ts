import { metadata } from '@/app/layout';
import { NextResponse } from 'next/server'
const stripe = require('stripe')('STRIPE_SECRET_REMOVED');

export async function GET() {
  return NextResponse.json({ message: 'Hello from Spa API!' })
}

export async function POST(req: Request) {
    
    return new Promise<any>(async (resolve, reject) => {

        const { paymentID  } = await req.json();

        console.log("PAYMENT ID", paymentID)

        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentID);

        // console.log("PAYMENT INTENT", paymentIntent)


        // const chargeId = paymentIntent.latest_charge as string;

        // console.log("Charge ID", chargeId)


        // const refund = await stripe.refunds.create({
        //   charge: chargeId,
        // });

        const refund = await stripe.refunds.create({
          payment_intent: paymentID,
        });

      
        if (refund.error) {
          resolve(NextResponse.json({error:true,errorMessage:refund.error}))
        } 
        else {
          resolve(NextResponse.json({error:false,refund}))
        }

        

    })

  
  }