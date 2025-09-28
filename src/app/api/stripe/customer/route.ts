import { NextResponse } from 'next/server'
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_ID);

export async function GET() {
  return NextResponse.json({ message: 'Hello from Spa API!' })
}

export async function POST(request: Request) {
    const body = await request.json();
    

      stripe.customers.create(
      {    
        name: body.name,
        email: body.email
      }
      ,
      function (err:any, customer:any) {
          if (err) {
            return NextResponse.json({error:true,errorMessage:err})
          } 
          else {
            return NextResponse.json({error:false,customer:customer})
          }
      });


  
    return NextResponse.json({ message: "POST received", user: body.name });
  }