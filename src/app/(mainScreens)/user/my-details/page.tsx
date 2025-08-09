"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MyDetails() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");


    const [currenPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>My Details</span>
            </div>
            <span className="text-6xl text-accent font-medium">My Details</span>
        </div>

        <div className="w-full flex flex-row flex-wrap gap-8">
                    
            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">First Name*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Last Name*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Email*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Confirm Password*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

        </div>

        <div className="w-full h-px bg-primary/30"/>
        
        <div className="w-full flex flex-col items-start gap-10">

            <span className="text-3xl font-medium">Currency</span>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Default Currency*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>

        </div>

    
        <div className="w-full h-px bg-primary/30"/>
        
        <div className="flex flex-col items-start gap-10">

            <span className="text-3xl font-medium">Change Password</span>

            <div className="w-full flex flex-row flex-wrap gap-8">
                        
                <div className="flex flex-col gap-1.5 ai-start min-w-[300px]">
                    <span className="font-medium">Current Password*</span>
                    <input 
                        className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                        type="password"
                        value={currenPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5 ai-start min-w-[300px]">
                    <span className="font-medium">New Password*</span>
                    <input 
                        className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                        type="password"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5 ai-start min-w-[300px]">
                    <span className="font-medium">Confirm Password*</span>
                    <input 
                        className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                        type="password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>


            </div>

                <Button>UPDATE PASSWORD</Button>
        </div>



    </div>)

}