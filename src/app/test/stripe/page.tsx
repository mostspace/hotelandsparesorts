"use client";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaymentComponent } from "@/components/PaymentComponent";

const appearance = {
  variables: {},

  theme:'night'
};
let stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC
const stripeTest = loadStripe(stripeKey || "");
// const stripeLive = loadStripe(process.env.NEXT_PUBLIC_STRIPE_LIVE);


export default function StripeTestPage() {

  const [amount, setAmount] = useState(0);

  const [intentID, setIntentID] = useState<any>('');
  const [options, setOptions] = useState<any>(null);
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);


  const createPaymentIntent = async () => {
 
    setShowPaymentInput(false);
    setIntentID('');

    try {
      const res = await fetch("/api/stripe/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerID: "cus_SUCJDgGqMJtTX5", amount:amount*100 }),
      });
  
      if (!res.ok) throw new Error(`Error: ${res.status}`);
  
      const data = await res.json();
      let intent = data.paymentIntent.client_secret;
      setOptions({ clientSecret: intent, appearance: appearance });
      setShowPaymentInput(true);
      setIntentID(intent);

    } catch (error) {
      console.error("API POST call failed:", error);
    }
  };



  const stripeResponse = (response:any) => {
    console.log('STRIPRE RESPONSE', response);

    if (response.success) {
      setShowPaymentInput(false);
      setIntentID(null);
    } else {
      console.log('ERROR', response.error);
    }
  };

  const payClicked = () => {
    setSubmitCount(submitCount + 1);
  };
   
    
  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>STRIPE PAGE</span>

      <div className="flex flex-col items-center gap-2" >
        <Input
            className="auth-input responsive-auth-input"
            placeholder="Email address"
            type='number'
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
          <Button onClick={createPaymentIntent}>Create Payment</Button>
      </div>

      {intentID && (
        <div className='flex flex-col items-center gap-2'>
          <Elements stripe={stripeTest} options={options}>
            <PaymentComponent
              stripeResponse={stripeResponse}
              submitCount={submitCount}
              payment={true}
              savedCard={false}
              intentID={intentID}
            />
          </Elements>
            <Button className='primaryButton width50' onClick={payClicked}>
              Pay
            </Button>
        
        </div>
      )}

    </div>
  );
}
