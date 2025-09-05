"use client";

import { auth } from "@/app/firebase";
import { HotelTile } from "@/components/search/HotelTile";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AllBookings() {

    const [bookings, setBookings] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any>("");
    const [orderSearch, setOrderSearch] = useState("");
    const [bookingType, setBookingType] = useState("all");

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
            if((booking.order_id+"").includes(orderSearch))
            {
                compArray.push(
                <HotelTile 
                        hotel={booking.hotel} 
                        checkIn={booking.check_in}
                        checkOut={booking.check_out}
                        rooms= {booking.rooms || []}
                        booking={booking}
                        source={"AllBookings"}
                        locationName={""} 
                    />)
            }
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
                <span>All Bookings</span>
            </div>
            <span className="text-6xl text-accent font-medium">All Bookings</span>

            <div className="flex gap-8 items-end">
            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Search by Order ID</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={orderSearch} 
                    onChange={(e) => setOrderSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Booking Status</span>
                <select 
                    className="w-[200px] h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    value={bookingType} 
                    onChange={(e) => setBookingType(e.target.value)}
                >
                        <option key={1} value={"All"}>All</option>
                        <option key={1} value={"current"}>Current</option>
                        <option key={1} value={"past"}>Past</option>
                        <option key={1} value={"cancelled"}>Cancelled</option>

                </select>
            </div>

                


            </div>

            {errorMessage!=="" && <span className="text-[red]">{errorMessage}</span>}
            {showBookings(bookingType)}
        </div>

    </div>)

}