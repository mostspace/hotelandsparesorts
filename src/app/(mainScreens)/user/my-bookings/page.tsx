"use client";

export default function MyBookings() {


    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>My Bookings</span>
            </div>
            <span className="text-6xl text-accent font-medium">My Bookings</span>

        </div>

    </div>)

}