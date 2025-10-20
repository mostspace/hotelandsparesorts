import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentComponent } from "../PaymentComponent";
import { BillingAddressComponent } from "../BillingAddressComponent";

import { Button } from "../ui/button";
import { trackAddPaymentInfo, trackPaymentInitiated } from "@/utils/dataLayer";

const appearance = {
  variables: {},

  theme:'light'
};

let stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC
const stripeTest = loadStripe(stripeKey || "");// const stripeLive = loadStripe(process.env.NEXT_PUBLIC_STRIPE_LIVE);

interface PaymentDetailsProps {
    bookingID:any
    successfulPayment:any
    amountToCharge:number
    booking:any
}

export const BookingPaymentDetails = (props:PaymentDetailsProps) => {

    const [intentID, setIntentID] = useState<any>('');
    const [options, setOptions] = useState<any>(null);
    const [submitCount, setSubmitCount] = useState(0);
    const [noCharge, setNoCharge] = useState(false);

    useEffect(() => {

        if(props.amountToCharge === 0){
            console.log("NO CHARGE")
            setNoCharge(true)
        }else{
            setNoCharge(false)
            createPaymentIntent(props.amountToCharge)
        }

    }, [props.amountToCharge]);
    
    // Track add_payment_info when payment form is displayed
    useEffect(() => {
        if(props.booking && intentID) {
            trackAddPaymentInfo(
                props.booking.order_id.toString(),
                props.booking.room_name,
                parseFloat(props.amountToCharge),
                'Card',
                1,
                'EUR'
            );
        }
    }, [intentID, props.booking, props.amountToCharge]);


    const createPaymentIntent = async (amount:number) => {

    setIntentID('');

    try {
        const res = await fetch("/api/stripe/payments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerID: "cus_SUCJDgGqMJtTX5", amount:amount*100, bookingID:props.bookingID }),
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
        // Track payment_initiated event
        if(props.booking) {
            trackPaymentInitiated(
                props.booking.order_id.toString(),
                props.booking.room_name,
                parseFloat(props.amountToCharge),
                response.response.paymentIntent.id,
                1,
                'EUR'
            );
        }
        
        setIntentID(null);
        props.successfulPayment(response.response.paymentIntent.id)

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
        <div className="w-full flex flex-col gap-7.5 items-end ">

            {!noCharge && <div className="w-full p-[28px] flex flex-col gap-[60px] items-start border border-primary/50  rounded-lg overflow-hidden">

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

            </div>}

            <Button className="bg-accent font-bold text-lg p-7" onClick={payClicked}>COMPLETE BOOKING</Button>
        </div>

    )
}