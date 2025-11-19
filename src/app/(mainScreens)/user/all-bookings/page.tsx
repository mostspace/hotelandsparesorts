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
    const [orderBy, setOrderBy] = useState("createdDate");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        setLoading(true);
        try {
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
        } catch (error) {
            setErrorMessage("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }


    const getFilteredBookings = (type:string) => {
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

        if(orderBy === 'createdDate')
        {
            selectedBookings.sort((a, b) => {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            });
        }
        else if(orderBy === 'checkIn')
        {
            selectedBookings.sort((a, b) => {
                return new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
            });
        }

        // Filter by search
        const filteredBySearch = selectedBookings.filter(booking => {
            return (booking.order_id+"").includes(orderSearch)
        });

        return filteredBySearch;
    }

    const showBookings = (type:string) => {
        let compArray:any[] = []
        const filteredBookings = getFilteredBookings(type);
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

        paginatedBookings.forEach(booking => {
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
        });

        if(compArray.length>0){
            return <div className="w-full flex flex-col gap-4 sm:gap-6">{compArray}</div>
        }else{
            return <span className="text-sm sm:text-base">No {type} bookings.</span>
        }
    }

    const showPagination = (type:string) => {
        const filteredBookings = getFilteredBookings(type);
        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        
        if(totalPages <= 1) return null;

        const compArray:any[] = [];
        
        // Previous button
        compArray.push(
            <button
                key="prev"
                className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] border border-accent flex justify-center items-center cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/10'}`}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <span className="text-base sm:text-lg font-medium text-accent">‹</span>
            </button>
        );

        // Page numbers
        let lastAdded = 0;
        for(let i = 1; i <= totalPages; i++){
            // Show first page, last page, current page, and pages around current
            if(i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)){
                // Add ellipsis before if there's a gap
                if(i - lastAdded > 1 && lastAdded > 0){
                    compArray.push(
                        <span key={`ellipsis-before-${i}`} className="text-base sm:text-lg text-accent px-1">...</span>
                    );
                }
                compArray.push(
                    <div 
                        key={i}
                        className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] border border-accent flex justify-center items-center cursor-pointer ${i === currentPage ? 'bg-accent' : 'bg-light hover:bg-accent/10'}`} 
                        onClick={() => setCurrentPage(i)}
                    >
                        <span className={`text-base sm:text-lg font-medium ${i === currentPage ? 'text-light' : 'text-accent'}`}>{i}</span>
                    </div>
                );
                lastAdded = i;
            }
        }

        // Next button
        compArray.push(
            <button
                key="next"
                className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] border border-accent flex justify-center items-center cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/10'}`}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className="text-base sm:text-lg font-medium text-accent">›</span>
            </button>
        );

        return (
            <div className="flex gap-1 sm:gap-2 items-center mt-6 flex-wrap justify-center sm:justify-start">
                {compArray}
            </div>
        );
    }

    return(<div className="flex flex-col gap-6 sm:gap-8 md:gap-[50px] items-start w-full">

        <div className="flex flex-col gap-4 sm:gap-5 items-start text-primary/70 text-base sm:text-lg w-full">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2 text-sm sm:text-base">
                <span>My Account</span>
                <span>{">"}</span>
                <span>All Bookings</span>
            </div>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-accent font-medium">All Bookings</span>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-end w-full">
                <div className="flex flex-col gap-1.5 items-start w-full sm:min-w-[250px] md:min-w-[300px]">
                    <span className="font-medium text-sm sm:text-base">Search by Order ID</span>
                    <input 
                        className="w-full h-[48px] sm:h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-sm sm:text-base md:text-xl" 
                        type="text"
                        value={orderSearch} 
                        onChange={(e) => {
                            setOrderSearch(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        placeholder="Enter Order ID..."
                    />
                </div>
                <div className="flex flex-col gap-1.5 items-start w-full sm:w-auto">
                    <span className="font-medium text-sm sm:text-base">Booking Status</span>
                    <select 
                        className="w-full sm:w-[200px] h-[48px] sm:h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-sm sm:text-base md:text-xl" 
                        value={bookingType} 
                        onChange={(e) => {
                            setBookingType(e.target.value);
                            setCurrentPage(1); // Reset to first page on filter change
                        }}
                    >
                            <option key={1} value={"all"}>All</option>
                            <option key={2} value={"current"}>Current</option>
                            <option key={3} value={"past"}>Past</option>
                            <option key={4} value={"cancelled"}>Cancelled</option>

                    </select>
                </div>

                <div className="flex flex-col gap-1.5 items-start w-full sm:min-w-[250px] md:min-w-[300px]">
                    <span className="font-medium text-sm sm:text-base">Order By</span>
                    <select 
                        className="w-full sm:w-[300px] h-[48px] sm:h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-sm sm:text-base md:text-xl" 
                        value={orderBy} 
                        onChange={(e) => {
                            setOrderBy(e.target.value);
                            setCurrentPage(1); // Reset to first page on sort change
                        }}
                    >
                        <option key={1} value={"createdDate"}>Date Booking Made</option> 
                        <option key={2} value={"checkIn"}>Check In Date</option>

                    </select>
                </div>
            </div>

            {errorMessage!=="" && <span className="text-[red] text-sm sm:text-base">{errorMessage}</span>}
            {loading ? (
                <div className="w-full flex justify-center items-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        <span className="text-base sm:text-lg text-primary/70">Loading bookings...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-full">
                        {showBookings(bookingType)}
                    </div>
                    {showPagination(bookingType)}
                </>
            )}
        </div>

    </div>)

}