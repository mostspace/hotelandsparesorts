"use client";

import { auth } from "@/app/firebase";
import { HotelTile } from "@/components/search/HotelTile";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AllBookings() {

    const [bookings, setBookings] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any>("");
    const [orderSearch, setOrderSearch] = useState("");

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
        
        const res = await fetch("/api/bookings/all-bookings", {
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
        
        if(data.error){setErrorMessage(data.error)}
        else{setBookings(data)}
    }

    const showBookings = () => {
        let compArray:any[] = []

        bookings.forEach(booking => {
            if((booking.order_id+"").includes(orderSearch))
            {

                compArray.push(
                <HotelTile 
                    hotel={booking.hotel} 
                    checkIn={booking.check_in}
                    checkOut={booking.check_out}
                    rooms= {[]}
                    booking={booking}
                    source={"AllBookings"}
                    locationName={""} 
                />)
            }
        });

        return compArray
    }

    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>All Bookings</span>
            </div>
            <span className="text-6xl text-accent font-medium">All Bookings</span>

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Search by Order ID</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={orderSearch} 
                    onChange={(e) => setOrderSearch(e.target.value)}
                />
            </div>

            {errorMessage!=="" && <span className="text-[red]">{errorMessage}</span>}
            {showBookings()}
        </div>

    </div>)

}