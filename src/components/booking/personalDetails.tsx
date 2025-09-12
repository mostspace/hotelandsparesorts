import { useState } from "react";
import { Button } from "../ui/button";
import { auth } from "@/app/firebase";

export interface BPDProps{
    nextStep:any
    setDetails:any
}

export const BookingPersonalDetails = (props:BPDProps) => {

     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [email, setEmail] = useState("");
     const [phoneNumber, setPhoneNumber] = useState("");
     const [country, setCountry] = useState("");

     const [specialRequest, setSpecialRequest] = useState("");

     const [inputError, setInputError] = useState("");

     
     
     const confirm = () => {
        
        if(firstName === ""){setInputError("firstName")}
        else if(lastName === ""){setInputError("lastName")}
        else if(email === ""){setInputError("email")}
        else if(phoneNumber === ""){setInputError("phoneNumber")}
        else if(country === ""){setInputError("country")}
        else{

            let details = {
                firstName,
                lastName,
                email,
                phoneNumber,
                country,
                specialRequest
            }
            props.setDetails(details)
            props.nextStep()

        }
     }

     const isDisabled = () => {
         if(firstName === ""){return true}
        else if(lastName === ""){return true}
        else if(email === ""){return true}
        else if(phoneNumber === ""){return true}
        else if(country === ""){return true}
        else{return false}
     }


    return(
        <div className="w-full flex flex-col gap-7.5 items-end">


            {/* PERSONAL DETAILS INPUTS */}
            <div className="p-[28px] flex flex-col gap-5 items-start border border-primary/50  rounded-lg overflow-hidden">
                <span className="text-4xl" style={{fontFamily:'Harlow'}}>Your Details</span>

                <div className="w-full flex flex-row flex-wrap gap-8">
                    
                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className={`font-medium ${inputError==="firstName"?"text-[red]":""}`}>First Name*</span>
                        <input 
                            className={`w-full h-[54px] bg-transparent border focus:outline-none p-[10px] text-xl ${inputError==="firstName"?"border-[red]":"border-primary/50"}`} 
                            type="text"
                            value={firstName} 
                            onChange={(e) => {setFirstName(e.target.value);if(inputError==="firstName"){setInputError("")}}}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className={`font-medium ${inputError==="lastName"?"text-[red]":""}`}>Last Name*</span>
                        <input 
                            className={`w-full h-[54px] bg-transparent border focus:outline-none p-[10px] text-xl ${inputError==="lastName"?"border-[red]":"border-primary/50"}`} 
                            type="text"
                            value={lastName} 
                            onChange={(e) => {setLastName(e.target.value);if(inputError==="lastName"){setInputError("")}}}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className={`font-medium ${inputError==="email"?"text-[red]":""}`}>Email*</span>
                        <input 
                            className={`w-full h-[54px] bg-transparent border focus:outline-none p-[10px] text-xl ${inputError==="email"?"border-[red]":"border-primary/50"}`} 
                            type="text"
                            value={email} 
                            onChange={(e) => {setEmail(e.target.value);if(inputError==="email"){setInputError("")}}}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className={`font-medium ${inputError==="phoneNumber"?"text-[red]":""}`}>Phone Number*</span>
                        <input 
                            className={`w-full h-[54px] bg-transparent border focus:outline-none p-[10px] text-xl ${inputError==="phoneNumber"?"border-[red]":"border-primary/50"}`} 
                            type="number"
                            value={phoneNumber} 
                            onChange={(e) => {setPhoneNumber(e.target.value);if(inputError==="phoneNumber"){setInputError("")}}}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                        <span className={`font-medium ${inputError==="country"?"text-[red]":""}`}>Country*</span>
                        <input 
                            className={`w-full h-[54px] bg-transparent border focus:outline-none p-[10px] text-xl ${inputError==="country"?"border-[red]":"border-primary/50"}`} 
                            type="text"
                            value={country} 
                            onChange={(e) => {setCountry(e.target.value);if(inputError==="country"){setInputError("")}}}
                        />
                    </div>

                </div>
            </div>

            <div className="w-full p-[28px] flex flex-col gap-5 items-start border border-primary/50 rounded-lg overflow-hidden">
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


            {/* {!auth || !auth.currentUser && <div className="w-full p-[28px] flex flex-col gap-3.5 items-start border border-primary/50">
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
            </div>} */}


            <div className="flex gap-8 items-center">

                {inputError!=="" && <span className="text-[red]">Invalid input, please update</span>}

                <Button className="bg-accent hover:bg-accent/90 text-light p-[22px]" disabled={isDisabled()} onClick={confirm}>
                    <div className="flex flex-row gap-3 items-center">
                        <span className="font-bold text-lg">CONFIRM & PAY</span>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5.90937L8.97031 5L17 12.5L8.97031 20L8 19.0953L15.0547 12.5L8 5.90937Z" fill="white"/>
                        </svg>
                    </div>
                </Button>

            </div>


        </div>
    )

}