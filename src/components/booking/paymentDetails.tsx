import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentComponent } from "../PaymentComponent";
import { BillingAddressComponent } from "../BillingAddressComponent";

import { Button } from "../ui/button";

const appearance = {
  variables: {},

  theme:'light'
};

const stripeTest = loadStripe('pk_test_51Pt4eIP0VWupOVM4V6pnDzuRafZp1xjCMslMceihfV2nKbbBjkm2QkLeGYBWGlCWCznxB4GMkZv7TnyjkgIglOY600TtaK2Q9s');
// const stripeLive = loadStripe(process.env.NEXT_PUBLIC_STRIPE_LIVE);

interface PaymentDetailsProps {
    successfulPayment:any
    amountToCharge:number
}

export const BookingPaymentDetails = (props:PaymentDetailsProps) => {

    const [intentID, setIntentID] = useState<any>('');
    const [options, setOptions] = useState<any>(null);
    const [submitCount, setSubmitCount] = useState(0);
    const [noCharge, setNoCharge] = useState(false);

    useEffect(() => {

        if(props.amountToCharge === 0){
            setNoCharge(true)
        }else{
            createPaymentIntent(props.amountToCharge)
        }

    }, [props.amountToCharge]);


    const createPaymentIntent = async (amount:number) => {

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
        setIntentID(intent);

    } catch (error) {
        console.error("API POST call failed:", error);
    }
    };


  const stripeResponse = (response:any) => {
    console.log('STRIPRE RESPONSE', response);

    if (response.success) {
      setIntentID(null);
      props.successfulPayment()

    } else {
      console.log('ERROR', response.error);
    }
  };

  const payClicked = () => {
    
    if(noCharge){
        props.successfulPayment()
    }else{
        setSubmitCount(submitCount + 1);
    }
  };
    

    return(
        <div className="w-full flex flex-col gap-7.5 items-end">

            <div className="w-full p-[28px] flex flex-col gap-[60px] items-start border border-primary/50">

                <div className="w-full flex flex-col gap-5 items-start">
                    <span className="text-4xl" style={{fontFamily:'Harlow'}}>Step 2: Payment Details</span>

                    {intentID && (
                        <div className='w-full flex flex-col items-center gap-2'>
                            <Elements stripe={stripeTest} options={options}>
                                <PaymentComponent
                                stripeResponse={stripeResponse}
                                submitCount={submitCount}
                                payment={true}
                                savedCard={false}
                                intentID={intentID}
                                
                                />
                            </Elements>
                        </div>
                    )}

                    {noCharge && <div className="w-full flex justify-center">No charge</div>}

                </div>

                <div className="h-px w-full bg-primary/50"/>

                <div className="w-full flex flex-col gap-5 items-start">
                    <span className="text-4xl" style={{fontFamily:'Harlow'}}>Step 3: Billing Address</span>
                    {intentID && (
                        <div className='w-full flex flex-col items-center gap-2'>
                            <Elements stripe={stripeTest} options={options}>
                                <BillingAddressComponent
                                submitCount={submitCount}
                                intentID={intentID}
                                />
                            </Elements>
                        </div>
                    )}
                </div>

            </div>

            <Button className="bg-accent font-bold text-lg p-7" onClick={payClicked}>COMPLETE BOOKING</Button>
        </div>

    )
}