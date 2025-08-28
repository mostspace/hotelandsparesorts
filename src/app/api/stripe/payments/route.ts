import { metadata } from '@/app/layout';
import { NextResponse } from 'next/server'
const stripe = require('stripe')('STRIPE_SECRET_REMOVED');

export async function GET() {
  return NextResponse.json({ message: 'Hello from Spa API!' })
}

export async function POST(request: Request) {
    const body = await request.json();
    
    return new Promise<any>((resolve, reject) => {


      stripe.paymentIntents.create(
      {    
          customer: body.customerID,
          payment_method_types: ['card'],
          amount: body.amount, 
          currency: "eur",
          metadata:{
            bookingID:body.bookingID
          }
      }
      ,
      function (err:any, paymentIntent:any) {
          if (err) {
            resolve(NextResponse.json({error:true,errorMessage:err}))
          } 
          else {
            resolve(NextResponse.json({error:false,paymentIntent:paymentIntent}))
          }
      });

    })

  
  }