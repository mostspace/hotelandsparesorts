"use client";

import { auth } from "@/app/firebase";
import StripeTestPage from "@/app/test/stripe/page";
import { BookingConfirmed } from "@/components/booking/bookingConfirmed";
import { BookingDetails } from "@/components/booking/bookingDetails";
import { BookingPaymentDetails } from "@/components/booking/paymentDetails";
import { BookingPersonalDetails } from "@/components/booking/personalDetails";
import { PriceSummary } from "@/components/booking/priceSummary";
import { VoucherApply } from "@/components/booking/voucherApply";
import ErrorPopUp from "@/components/general/ErrorPopUp";
import { LoadingPopUp } from "@/components/LoadingPopUp";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendTemplateEmail } from "@/utils/email";

export default function BookingScreen() {

  const [currentStep, setCurrentStep] = useState(2);
  const [booking, setBooking] = useState<any>(null);
  
  const [amountToCharge, setAmountToCharge] = useState(0);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState<any>(false);
  const [timedOut, setTimedOut] = useState<any>(false);

  // const [remainingTime, setRemainingTime] = useState(100);


  const searchParams = useSearchParams();
  const router = useRouter();
  


  useEffect(() => {
   
      const order = +(searchParams.get('order') ||0);

      
      retrieveBooking(order || 0)


    }, [searchParams]);

  useEffect(() => {
   
    window.scrollTo({
      top: 0,
      behavior: "smooth" // or "auto" for instant jump
    });

  }, [currentStep]);

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
            amount:booking.ratehawk_amount,
            currencyCode:booking.currency_code,
            rooms:booking.rooms
          }),
      });

      if (!res.ok) {
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();

      if(data.error && data.error!=='5xx' && data.error!=='timeout' && data.error!=='unknown'){
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: ${res.status}`);
      }
      return(data)
  }


  const checkBookingStatusRateHawk = async (attempt:number) => {
    
    const res = await fetch("/api/ratehawk/booking/finish", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
            partnerID: booking.partner_id,
          }),
      });

      if (!res.ok) {
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();

      if(data.status === "ok")
      {
        return(data)
        
      }
      else if(data.error && data.error!=="timeout" && data.error!=="unknown" && data.error!=="5xx"){
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: Too many failed attempts`);
      }
      else if(attempt<10){
        await delay(5000)
        let recurse:any = await checkBookingStatusRateHawk(attempt+1)
        return(recurse)
      }else{
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: Too many failed attempts`);
      }

  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  const completeBookingDB = async (stripeID:string) => {

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
            personalDetails,
            stripeID:amountToCharge===0?"":stripeID,
            uid:uid
          }),
      });

      if (!res.ok){
        setLoading(false)
        setShowError(true)
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      return(data)
  }

  const successfulPayment = async (stripeID:string) => {

    if(voucherCode!==""){await redeemVoucher()}

    setLoading(true)
    await completeBookingRateHawk()
    await checkBookingStatusRateHawk(1)
    await completeBookingDB(stripeID)
    setLoading(false)
    setCurrentStep(4)
    sendConfirmationEmail()
    
  }

  const redeemVoucher = async () => {

    let amount = (+booking.amount) - (+amountToCharge)
    
    const res = await fetch("/api/vouchers/redeem", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
            voucherCode,
            amount
          }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      return(data)
  }


  const sendConfirmationEmail = async () => {

    let rooms = booking.rooms
    let adults = 0
    let children = 0

    rooms.forEach((element:any)=> {
      adults += element.adults
      children += element.children
    });

    const order = +(searchParams.get('order') ||0);

     await sendTemplateEmail(personalDetails.email, "Booking Confirmation Template for HS", {
            FIRST_NAME: personalDetails.firstName,
            HOTEL_NAME: booking.hotel.hotel_name,
            BOOKING_ID: order,
            ROOMS_COUNT: booking.rooms.length,
            ROOMS_TYPE: booking.room_name,
            GUESTS_COUNT: adults+children,
            ADULTS_COUNT: adults,
            CHILDREN_COUNT: children,
            CHECKIN_DATE: formatDate(booking.check_in),
            CHECKOUT_DATE: formatDate(booking.check_out),
            CANCEL_NOTE:"Free Cancellation before " + formatDate(booking.free_cancellation_before),
            CANCEL_URL:"https://www.hotelandsparesorts.com/contact-us",
            TOTAL_AMOUNT:"€"+booking.amount,
            PDF_LINK: `https://booking.hotelandsparesorts.com/api/ratehawk/pdf?partnerID=${booking.partner_id}`,
            SUPPORT_EMAIL:"hello@hotelandsparesorts.com",
            SUPPORT_PHONE:"+35315446883"
    
        });
  }

  const formatDate = (dateStr:string) => {
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        
        return (formatted); // Wed, Oct 15, 2025
    }

  function Countdown({ expiry }: { expiry: Date }) {
    const [remainingTime, setRemainingTime] = useState(
      Math.max(0, expiry.getTime() - Date.now()) // ms until expiry
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTime(Math.max(0, expiry.getTime() - Date.now()));
      }, 1000); // update every second

      return () => clearInterval(interval); // cleanup
    }, [expiry]);

    // optional: convert to mm:ss
    const totalSeconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if(totalSeconds<=0 && !timedOut){
      setTimedOut(true)
    }

    return (
      <div className="w-full flex justify-end">
        <span className="mt-[-20px] mb-[-10px] font-medium text-lg text-accent">
          Time Remaining to complete booking: {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  }

  
  const check = <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.33321 12.84L2.19988 7.8L0.48877 9.48L7.33321 16.2L21.9999 1.8L20.2888 0.119995L7.33321 12.84Z" fill="white"/>
  </svg>

  return (
    <div className="w-full flex flex-col items-center bg-light lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%] px-5 py-[90px] gap-[86px]" >
    
    {loading && <LoadingPopUp title="Securing Your Escape…" subtitle="Please hold on as we confirm every detail of your luxury getaway."/>}

    {showError && <ErrorPopUp 
          title="Error booking room" 
          subtitle="There was an issue when trying to finalise the booking." 
          close={()=>setShowError(false)}
          buttonText="Return to Hotel Profile"
          buttonClicked={()=>router.back()}
          
      />} 

      {timedOut && currentStep<4 && <ErrorPopUp 
          title="Booking Timed Out" 
          subtitle="You ran out of time to complete the booking, please select a new rate and try again." 
          close={()=>setShowError(false)}
          buttonText="Return to Hotel Profile"
          buttonClicked={()=>router.back()}
          hideClose={true}
      />} 

    {/* <span className="mt-[-50px] mb-[-30px] font-medium text-lg text-accent">Time Remaining on booking: {remainingTime}</span> */}
    {booking && currentStep<4 && <Countdown expiry={new Date(new Date(booking.created_at).getTime() + 10 * 60 * 1000)} />}


    {/* STEP BAR */}
    <div className="w-full flex flex-row md:gap-8 gap-2 items-center text-lg font-medium">
        

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


    {currentStep === 2 && booking && <div className="w-full flex md:flex-row flex-col items-start gap-8">
      
      <div className="flex flex-col gap-7.5">
        <BookingDetails booking={booking}/>
        <PriceSummary booking={booking} amountToCharge={amountToCharge}/>
      </div>

      <BookingPersonalDetails nextStep={()=>setCurrentStep(3)} setDetails={setPersonalDetails}/>
    
    </div>}
      
    {currentStep === 3 && booking  && <div className="w-full flex md:flex-row flex-col items-start gap-8">

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
        <BookingPaymentDetails bookingID={booking.order_id} successfulPayment={successfulPayment} amountToCharge={amountToCharge}/>
      </div>

    </div>}


    {currentStep === 4 && <BookingConfirmed email={personalDetails.email} bookingNumber={booking.order_id}/>}




    </div>
  );
}












