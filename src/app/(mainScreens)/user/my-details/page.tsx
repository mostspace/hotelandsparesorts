"use client";

import { auth } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useEffect, useState } from "react";

export default function MyDetails() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [currency, setCurrency] = useState("");


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
    const [detailsStatus, setDetailsStatus] = useState("");
    const [currencyStatus, setCurrencyStatus] = useState("");
    const [passwordStatus, setPasswordStatus] = useState("");


    useEffect(() => {
        if(auth){
            const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadDetails()
            }
    
            })
            return () => unsubscribe();
        }
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps
    


    const loadDetails = async () => {

        let currentUser = auth?.currentUser

        const res = await fetch(`/api/users/${currentUser?.uid}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        console.log("USER Details", data)

        setEmail(data.email)
        setFirstName(data.first_name || "")
        setLastName(data.last_name || "")
        setPhoneNumber(data.phone || "")
        setCurrency(data.currency || "")

    }

    const updateDetails = () => {

    }

    const updateCurrency = () => {

    }

    const handleUpdatePassword = () => {

        if(newPassword === ""){
            setPasswordStatus("Please fill in a valid password");
            return;
        }
        else if(newPassword.length<6){
            setPasswordStatus("Password must be at least 6 characters long");
            return;
        }
        else if(confirmPassword !== newPassword){
            setPasswordStatus("Passwords don't match");
            return;
        }
        

        let currentUser = auth?.currentUser
        
        const credentials = EmailAuthProvider.credential(
            currentUser?.email || "",
            currentPassword
        )

        setPasswordStatus("Updating...")

        if(currentUser)
        {
            reauthenticateWithCredential(currentUser,credentials)
            .then(() => {

                updatePassword(currentUser,newPassword)
                .then(() => {
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setPasswordStatus("Password Updated Successfully")
                }).catch((error) => {
                    setPasswordStatus(error.message)
                })
            }).catch((error) => {
                setPasswordStatus(error.message)
            })

        }
        
    }

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
                <span className="font-medium">Phone Number</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

        </div>

        <Button
            variant="primary"
            className="px-5 py-3 text-sm md:text-md lg:text-[16px]"
        >
            Update
        </Button>


        <div className="w-full h-px bg-primary/30"/>
        
        <div className="w-full flex flex-col items-start gap-10">

            <span className="text-3xl font-medium">Currency</span>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Default Currency*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                />
            </div>

            <Button
                variant="primary"
                className="px-5 py-3 text-sm md:text-md lg:text-[16px]"
            >
                Update
            </Button>
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
                        value={currentPassword} 
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
                <Button
                    variant="primary"
                    className="px-5 py-3 text-sm md:text-md lg:text-[16px]"
                >
                    Update Password
                </Button>
                <span>{passwordStatus}</span>
        </div>



    </div>)

}