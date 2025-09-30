"use client";

import { auth } from "@/app/firebase";
import { HotelTile } from "@/components/search/HotelTile";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function MyBookings() {

    const [bookings, setBookings] = useState<any[]>([]);
    const [orderSearch, setOrderSearch] = useState("");
    const [claimMessage, setClaimMessage] = useState("");

    useEffect(() => {
        if(auth){
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              retrieveBookings()
            }
          })
          return () => unsubscribe();
        }
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps

    const retrieveBookings = async () => {
        
        const res = await fetch("/api/bookings/my-bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
              uid: auth?.currentUser?auth.currentUser.uid:'test-uid-123'
            }),
        });
  
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        
        setBookings(data)
    }

    const claimBooking = async () => {
        
        setClaimMessage("Searching for booking...")

        const res = await fetch(`/api/bookings/${orderSearch}/claim`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
              uid: auth?.currentUser?auth.currentUser.uid:'test-uid-123'
            }),
        });
  
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        
        if(data.error){setClaimMessage(data.errorMessage)}
        else{
            bookings.push(data.booking)
            setBookings(bookings)
            setOrderSearch("")
            setClaimMessage("Successfully linked booking to your account")
        }

    }

    const showBookings = (type:string) => {
        let compArray:any[] = []

        var selectedBookings = bookings.slice().sort((a, b) => {
            return new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
        });

        const now = new Date();

        if(type === 'current'){
            selectedBookings = selectedBookings.filter(
                booking =>
                booking.status === "complete" &&
                new Date(booking.check_out) >= now
            )
        }
        else if(type === 'past'){
            selectedBookings = selectedBookings.filter(
                booking =>
                booking.status === "complete" &&
                new Date(booking.check_out) < now
            )
        }
        else if(type === 'cancelled'){
            selectedBookings = selectedBookings.filter(
                booking =>
                booking.status !== "complete" && booking.status !== "pending" 
            )
        }





        selectedBookings.forEach(booking => {
            compArray.push(
            <HotelTile 
                hotel={booking.hotel} 
                checkIn={booking.check_in}
                checkOut={booking.check_out}
                rooms = {booking.rooms || []}
                booking={booking}
                source={"MyBookings"}
                locationName={""} 
            />)
        });


        if(compArray.length>0){
            return compArray
        }else{
            return <span>No {type} bookings.</span>
        }
        
    }

    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>My Bookings</span>
            </div>



            <span className="text-6xl text-accent font-medium" style={{fontFamily:'Harlow'}}>My Bookings</span>

            {auth?.currentUser && <div className="flex flex-col gap-1.5 ai-start">
                <span className="text-2xl text-accent font-medium ">Add Booking</span>
                <span className="font-medium">If you made a booking in guest mode, you can link it to your account here</span>
                <div className="flex gap-3 items-center">
                    <input 
                        className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                        type="text"
                        placeholder="Booking Number"
                        value={orderSearch} 
                        onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    <Button className="bg-accent hover:bg-accebt/90 text-lg p-6" disabled={!orderSearch} onClick={claimBooking}>Add Booking</Button>
                </div> 
                <span className={`${claimMessage.includes("Error")?'text-[red]':'text-primary'}`}>{claimMessage}</span>
            </div>}

            <div className="bg-primary/50 w-full h-px mt-5"/>

            <span className="text-primary font-medium mt-7">To cancel any bookings, please reach out to our team.</span>


            <span className="text-3xl text-accent font-medium ">Current Bookings</span>
            {showBookings("current")}


            <span className="text-3xl text-accent font-medium mt-10">Past Bookings</span>
            {showBookings("past")}

            <span className="text-3xl text-accent font-medium mt-10">Cancelled Bookings</span>
            {showBookings("cancelled")}

        </div>

    </div>)

}