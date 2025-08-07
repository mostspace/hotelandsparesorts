import { useState } from "react";
import { Button } from "../ui/button";

export interface BPDProps{
    nextStep:any
}

export const BookingPersonalDetails = (props:BPDProps) => {

     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [email, setEmail] = useState("");
     const [phoneNumber, setPhoneNumber] = useState("");
     const [country, setCountry] = useState("");

     const [specialRequest, setSpecialRequest] = useState("");


    return(
        <div className="w-full flex flex-col gap-7.5 items-end">


            {/* PERSONAL DETAILS INPUTS */}
            <div className="p-[28px] flex flex-col gap-5 items-start border border-primary/50">
                <span className="text-4xl" style={{fontFamily:'Harlow'}}>Your Details</span>

                <div className="w-full flex flex-row flex-wrap gap-8">
                    
                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className="font-medium">First Name*</span>
                        <input 
                            className="w-full h-[54px] bg-transparent border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="text"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className="font-medium">Last Name*</span>
                        <input 
                            className="w-full h-[54px] bg-transparent border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="text"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className="font-medium">Email*</span>
                        <input 
                            className="w-full h-[54px] bg-transparent border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="text"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className="font-medium">Phone Number*</span>
                        <input 
                            className="w-full h-[54px] bg-transparent border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="number"
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className="font-medium">Country*</span>
                        <input 
                            className="w-full h-[54px] bg-transparent border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="text"
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            <div className="w-full p-[28px] flex flex-col gap-5 items-start border border-primary/50">
                <div className="flex flex-col items-start gap-3.5">
                    <span className="text-2xl font-medium">Special requests</span>
                    <span className="text-lg">Special requests cannot be guaranteed – but the property will do its best to meet your needs.</span>
                </div>

                <textarea 
                    className="w-full h-[144px] border border-accent bg-muted/50 p-[15px] text-xl"
                    placeholder="Pleaste write your requests in English (optional)"
                    value={specialRequest} 
                    onChange={(e) => setSpecialRequest(e.target.value)}
                />
                
            </div>


            <div className="w-full p-[28px] flex flex-col gap-3.5 items-start border border-primary/50">
                <span className="text-4xl" style={{fontFamily:'Harlow'}}>Optional: Become a member for free</span>
                <div className="flex flex-row gap-4">
                    <div className="border border-primar/30 flex justify-center items-center">
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_209_9)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.66682 9.98672L1.70015 6.06672L0.37793 7.37338L5.66682 12.6L17.0002 1.40005L15.6779 0.0933838L5.66682 9.98672Z" fill="#333337"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_209_9">
                            <rect width="17" height="14" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <span className="text-lg">Access member deals and email exclusive offers.</span>
                </div>
            </div>


            <Button className="bg-accent text-light p-[22px]" onClick={props.nextStep}>
                <div className="flex flex-row gap-3 items-center">
                    <span className="font-bold text-lg">CONFIRM & PAY</span>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5.90937L8.97031 5L17 12.5L8.97031 20L8 19.0953L15.0547 12.5L8 5.90937Z" fill="white"/>
                    </svg>
                </div>
            </Button>


        </div>
    )

}