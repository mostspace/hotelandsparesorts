"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeleteAccount() {

    const [showPopUp, setShowPopUp] = useState(false);
    

    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2  text-primary/70 text-lg">
                <span>My Account</span>
                <span>{">"}</span>
                <span>Delete Account</span>
            </div>
            <span className="text-6xl text-accent font-medium">Delete Account</span>

            <span className="text-xl">If you delete your account, all your personal information, booking history, and saved preferences will be permanently removed.
            This action cannot be undone.</span>
        </div>

        <Button onClick={()=>setShowPopUp(true)}>DELETE ACCOUNT</Button>

        {showPopUp &&<div className="fixed top-0 left-0 h-full w-full bg-primary/50 flex justify-center items-center z-10">

            <div className="flex flex-col bg-light p-[70px] gap-[44px] relative items-center">

                <div className="absolute top-4 right-4 cursor-pointer" onClick={()=>setShowPopUp(false)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_113_839)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M24 2.4L21.6 0L12 9.6L2.4 0L0 2.4L9.6 12L0 21.6L2.4 24L12 14.4L21.6 24L24 21.6L14.4 12L24 2.4Z" fill="#333337"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_113_839">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>

                <span className="text-xl">Are you sure you want to delete your account?</span>

                <div className="flex flex-row gap-5">
                    <Button>YES</Button>
                    <Button>NO</Button>
                </div>

            </div>
        </div>}

    </div>)

}