"use client";

import { auth } from "@/app/firebase";
import { HotelTile } from "@/components/search/HotelTile";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function MyBookings() {

    const [bookings, setBookings] = useState<any[]>([]);

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

    const showBookings = () => {
        let compArray:any[] = []

        bookings.forEach(booking => {
            compArray.push(
            <HotelTile 
                hotel={booking.hotel} 
                checkIn={booking.check_in}
                checkOut={booking.check_out}
                adults={booking.adults}
                children={booking.children}
                booking={booking}
                source={"MyBookings"}
                locationName={""} 
            />)
        });

        return compArray
    }

    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>My Bookings</span>
            </div>
            <span className="text-6xl text-accent font-medium">My Bookings</span>

            {showBookings()}
        </div>

    </div>)

}