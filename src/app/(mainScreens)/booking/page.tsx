"use client";

import { auth } from "@/app/firebase";
import StripeTestPage from "@/app/test/stripe/page";
import { BookingConfirmed } from "@/components/booking/bookingConfirmed";
import { BookingDetails } from "@/components/booking/bookingDetails";
import { BookingPaymentDetails } from "@/components/booking/paymentDetails";
import { BookingPersonalDetails } from "@/components/booking/personalDetails";
import { PriceSummary } from "@/components/booking/priceSummary";
import { VoucherApply } from "@/components/booking/voucherApply";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingScreen() {

  const [currentStep, setCurrentStep] = useState(2);
  const [booking, setBooking] = useState<any>(null);
  
  const [amountToCharge, setAmountToCharge] = useState(0);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [voucherCode, setVoucherCode] = useState("");

  const searchParams = useSearchParams();
  


  useEffect(() => {
   
      const order = +(searchParams.get('order') ||0);

      
      retrieveBooking(order || 0)


    }, [searchParams]);

  const retrieveBooking = async (order:number) => {
        
      const res = await fetch("/api/bookings/retrieve", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
            bookingID: order
          }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      
      console.log("BOOKING RETRIEVED",data )
      setBooking(data)
      setAmountToCharge(data.amount)
      
  }

  const completeBookingRateHawk = async () => {
    
    const res = await fetch("/api/ratehawk/booking/start", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
            partnerID: booking.partner_id,
            personalDetails,
            amount:booking.amount
          }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      return(data)
  }

  const completeBookingDB = async () => {

    let uid = ""
    if(auth?.currentUser){
      uid = auth.currentUser.uid
    }

    const order = +(searchParams.get('order') ||0);

    const res = await fetch("/api/bookings/complete", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
            bookingID:order,
            amountPaid:amountToCharge,
            voucherUsed:voucherCode,
            uid:uid
          }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      return(data)
  }

  const successfulPayment = async () => {

    await completeBookingRateHawk()
    await completeBookingDB()
    setCurrentStep(4)
  }


  
  const check = <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.33321 12.84L2.19988 7.8L0.48877 9.48L7.33321 16.2L21.9999 1.8L20.2888 0.119995L7.33321 12.84Z" fill="white"/>
  </svg>

  return (
    <div className="w-full flex flex-col items-center bg-light px-[118px] py-[90px] gap-[86px]" >
      
    {/* STEP BAR */}
    <div className="w-full flex flex-row gap-8 items-center text-lg font-medium">
        
        <div className="flex w-170 flex-row gap-4 items-center">
            <div className={`w-[42px] h-[42px] rounded-full flex justify-center items-center ${currentStep>1?"bg-accent/50":"bg-accent"}`}>
                {currentStep>1?check:<span className="text-light text-xl">1</span>}
            </div>
            <span>Hotel Selected</span>
        </div>

        <div className="h-px w-full bg-primary/50"/>

        <div className="flex w-150 flex-row gap-4 items-center">
            <div className={`w-[42px] h-[42px] rounded-full flex justify-center items-center ${currentStep>2?" bg-accent/50":" bg-accent"}`}>
                {currentStep>2?check:<span className="text-light text-xl">2</span>}
            </div>
            <span>Your Details</span>
        </div>

        <div className="h-px w-full bg-primary/50"/>


        <div className="flex w-140 flex-row gap-4 items-center">
            <div className={`w-[42px] h-[42px] rounded-full flex justify-center items-center ${currentStep>3?"bg-accent/50":"bg-accent"}`}>
                {currentStep>3?check:<span className="text-light text-xl">3</span>}
            </div>
            <span>Final Step</span>
        </div>
    </div>


    {currentStep === 2 && booking && <div className="w-full flex flex-row items-start gap-8">
      
      <div className="flex flex-col gap-7.5">
        <BookingDetails booking={booking}/>
        <PriceSummary booking={booking} amountToCharge={amountToCharge}/>
      </div>

      <BookingPersonalDetails nextStep={()=>setCurrentStep(3)} setDetails={setPersonalDetails}/>
    
    </div>}
      
    {currentStep === 3 && booking  && <div className="w-full flex flex-row items-start gap-8">

      <div className="flex flex-col gap-7.5">
        <PriceSummary booking={booking} amountToCharge={amountToCharge}/>
        
        <div className="w-full border border-primary/50 p-6 flex flex-row gap-2 items-center">
          <span className="font-medium text-accent text-2xl">Cancellation policy</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_200_1537)">
            <path d="M14.0963 5.745H9.90382C9.79882 5.745 9.69382 5.79375 9.62632 5.8725C9.55132 5.95125 9.52132 6.06 9.53257 6.165L10.3988 13.4662C10.4213 13.6575 10.5788 13.8 10.7701 13.8H13.2301C13.4213 13.8 13.5788 13.6575 13.6013 13.4662L14.4676 6.165C14.4788 6.06 14.4488 5.95125 14.3738 5.8725C14.3063 5.79375 14.2013 5.745 14.0963 5.745Z" fill="#A56658"/>
            <path d="M12.0003 14.5162C10.9691 14.5162 10.1328 15.3525 10.1328 16.3837C10.1328 17.415 10.9691 18.255 12.0003 18.255C13.0316 18.255 13.8678 17.415 13.8678 16.3837C13.8678 15.3525 13.0316 14.5162 12.0003 14.5162Z" fill="#A56658"/>
            <path d="M12 0.75C5.7975 0.75 0.75 5.7975 0.75 12C0.75 18.2025 5.7975 23.25 12 23.25C18.2025 23.25 23.25 18.2025 23.25 12C23.25 5.7975 18.2025 0.75 12 0.75ZM12 22.5C6.21 22.5 1.5 17.79 1.5 12C1.5 6.21 6.21 1.5 12 1.5C17.79 1.5 22.5 6.21 22.5 12C22.5 17.79 17.79 22.5 12 22.5Z" fill="#A56658"/>
            </g>
            <defs>
            <clipPath id="clip0_200_1537">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
          </svg>

        </div>

        <div className="flex flex-col gap-2.5 items-start text-sm">
          <span><strong>Please note.</strong> This secures your booking. You won’t be charged until you check - in.</span>
          <span>By completing this booking, you’re agreeing to the <span className="underline text-accent pointer">terms & conditions.</span></span>
        </div>

      </div>

      <div className="w-full flex flex-col gap-7.5">
        <VoucherApply amount={booking.amount} setAmount={setAmountToCharge} setVoucherCode={setVoucherCode}/>
        <BookingPaymentDetails successfulPayment={successfulPayment} amountToCharge={amountToCharge}/>
      </div>

    </div>}


    {currentStep === 4 && <BookingConfirmed email={personalDetails.email}/>}




    </div>
  );
}












