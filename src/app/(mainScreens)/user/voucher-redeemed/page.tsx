"use client";

import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function VoucherRedeemed() {

    const [vouchers, setVouchers] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any>("");
    const [loading, setLoading] = useState(true);
    const [voucherSearch, setVoucherSearch] = useState("");
    const [filterFrom, setFilterFrom] = useState<Date | undefined>(undefined);
    const [filterTo, setFilterTo] = useState<Date | undefined>(undefined);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [refundingVoucher, setRefundingVoucher] = useState<string | null>(null);
    const [refundMessage, setRefundMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const fromCalendarRef = useRef<HTMLDivElement>(null);
    const toCalendarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if(auth){
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              checkAdminAndRetrieve()
            } else {
              router.push('/login');
            }
          })
          return () => unsubscribe();
        }
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps

    const checkAdminAndRetrieve = async () => {
        const uid = auth?.currentUser?.uid;
        if (!uid) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`/api/users/${uid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();

            if (data && data.isAdmin) {
                setIsAdmin(true);
                retrieveVouchers();
            } else {
                setIsAdmin(false);
                // Redirect non-admin users to my-details page
                router.push('/user/my-details');
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
            router.push('/user/my-details');
        }
    }

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fromCalendarRef.current && !fromCalendarRef.current.contains(event.target as Node)) {
                setShowFromCalendar(false);
            }
            if (toCalendarRef.current && !toCalendarRef.current.contains(event.target as Node)) {
                setShowToCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    

    const retrieveVouchers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/vouchers/all", {
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
            else{setVouchers(Array.isArray(data) ? data : [])}
        } catch (error) {
            setErrorMessage("Failed to load vouchers");
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                const parts = dateString.split("-");
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return dateString;
            }
            // Format as "DD Month YYYY" (e.g., "5 November 2025")
            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return dateString;
        }
    }

    const formatDateInput = (date: Date | undefined) => {
        if (!date) return "";
        return format(date, "yyyy-MM-dd");
    }

    const getFilteredVouchers = () => {
        let filtered = vouchers.slice();

        // Filter by search (search across partner, spa name, and voucher code)
        if (voucherSearch) {
            const searchLower = voucherSearch.toLowerCase();
            filtered = filtered.filter(voucher => 
                (voucher.partner_name || voucher.partner || "").toLowerCase().includes(searchLower) ||
                (voucher.spa_name || "").toLowerCase().includes(searchLower) ||
                (voucher.voucher_code || "").toLowerCase().includes(searchLower)
            );
        }

        // Filter by date range
        if (filterFrom) {
            filtered = filtered.filter(voucher => {
                const redeemedDate = voucher.redeemed_date ? new Date(voucher.redeemed_date) : null;
                if (!redeemedDate) return false;
                return redeemedDate >= filterFrom;
            });
        }

        if (filterTo) {
            filtered = filtered.filter(voucher => {
                const redeemedDate = voucher.redeemed_date ? new Date(voucher.redeemed_date) : null;
                if (!redeemedDate) return false;
                // Set to end of day for inclusive filtering
                const toDate = new Date(filterTo);
                toDate.setHours(23, 59, 59, 999);
                return redeemedDate <= toDate;
            });
        }

        return filtered;
    }

    const handleFilter = () => {
        setCurrentPage(1);
        // Filtering is handled in getFilteredVouchers
    }

    const handleReset = () => {
        setFilterFrom(undefined);
        setFilterTo(undefined);
        setVoucherSearch("");
        setCurrentPage(1);
    }

    const handleRefundVoucher = async (voucherCode: string, amount: number) => {
        if (!voucherCode || amount <= 0) {
            setRefundMessage({type: 'error', text: 'Invalid voucher code or amount'});
            return;
        }

        setRefundingVoucher(voucherCode);
        setRefundMessage(null);

        try {
            const res = await fetch("/api/vouchers/refund", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ voucherCode, amount }),
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data = await res.json();

            if (data.error) {
                setRefundMessage({type: 'error', text: data.error || 'Failed to refund voucher'});
            } else {
                setRefundMessage({type: 'success', text: `Successfully refunded €${amount.toFixed(2)} for voucher ${voucherCode}`});
                // Refresh vouchers list
                retrieveVouchers();
            }
        } catch (error) {
            console.error("Refund failed:", error);
            setRefundMessage({type: 'error', text: 'Failed to process refund. Please try again.'});
        } finally {
            setRefundingVoucher(null);
            // Clear message after 5 seconds
            setTimeout(() => setRefundMessage(null), 5000);
        }
    }

    const getPaginatedVouchers = () => {
        const filtered = getFilteredVouchers();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            data: filtered.slice(startIndex, endIndex),
            total: filtered.length
        };
    }

    const showVouchers = () => {
        const { data: paginatedVouchers, total } = getPaginatedVouchers();

        if (paginatedVouchers.length === 0) {
            return <span>No vouchers found.</span>;
        }

        return (
            <div className="w-full overflow-x-auto -mx-4 sm:-mx-2 md:mx-0">
                <table className="w-full border-collapse border border-primary/50 min-w-[800px]">
                    <thead>
                        <tr className="bg-primary/10">
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Partner</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Spa Name</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Voucher Code</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Value</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base hidden md:table-cell whitespace-nowrap">Redeemed Date</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Paid</th>
                            <th className="border border-primary/50 p-2 sm:p-3 text-left font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVouchers.map((voucher, index) => {
                            const value = parseFloat(voucher.value || voucher.amount || voucher.balance || 0);
                            const isPaid = voucher.paid === true || voucher.paid === 1 || voucher.payment_status === 'paid';
                            const voucherCode = voucher.voucher_code || "";
                            const isRefunding = refundingVoucher === voucherCode;

                            return (
                                <tr key={index} className="hover:bg-primary/5">
                                    <td className="border border-primary/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base">{voucher.partner_name || voucher.partner || "N/A"}</td>
                                    <td className="border border-primary/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base">{voucher.spa_name || "N/A"}</td>
                                    <td className="border border-primary/50 p-2 sm:p-3 font-mono text-xs sm:text-sm md:text-base">{voucherCode || "N/A"}</td>
                                    <td className="border border-primary/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base whitespace-nowrap">€{value.toFixed(2)}</td>
                                    <td className="border border-primary/50 p-2 sm:p-3 text-xs sm:text-sm md:text-base hidden md:table-cell">{formatDate(voucher.redeemed_date || voucher.redeemed_at || voucher.created_at)}</td>
                                    <td className="border border-primary/50 p-2 sm:p-3">
                                        {isPaid ? (
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </td>
                                    <td className="border border-primary/50 p-2 sm:p-3">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="h-7 sm:h-8 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                                            onClick={() => handleRefundVoucher(voucherCode, value)}
                                            disabled={!isPaid || isRefunding || !voucherCode || value <= 0}
                                        >
                                            {isRefunding ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-2 w-2 sm:h-3 sm:w-3 border-b-2 border-white mr-1 sm:mr-2"></div>
                                                    <span className="hidden sm:inline">Refunding...</span>
                                                    <span className="sm:hidden">...</span>
                                                </>
                                            ) : (
                                                'Refund'
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    const showPagination = () => {
        const { total } = getPaginatedVouchers();
        const totalPages = Math.ceil(total / itemsPerPage);
        
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

    return(
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-[50px] items-start w-full">

            <div className="flex flex-col gap-4 sm:gap-5 items-start text-primary/70 text-base sm:text-lg w-full">
                {/* BREADCRUMBS */}
                <div className="flex flex-row items-center gap-2 text-sm sm:text-base">
                    <span>My Account</span>
                    <span>{">"}</span>
                    <span>Voucher Redeemed</span>
                </div>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-accent font-medium">Voucher Redeemed</span>

                {/* Date Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end w-full">
                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <span className="font-medium text-sm sm:text-base">Filter from</span>
                        <div className="relative w-full sm:w-[200px]" ref={fromCalendarRef}>
                            <input 
                                className="w-full h-[48px] sm:h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-sm sm:text-base md:text-xl pr-10 cursor-pointer" 
                                type="text"
                                value={formatDateInput(filterFrom)}
                                onClick={() => setShowFromCalendar(!showFromCalendar)}
                                placeholder="yyyy-mm-dd"
                                readOnly
                            />
                            <svg 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70 pointer-events-none"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {showFromCalendar && (
                                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-primary/50 rounded shadow-lg sm:left-0 right-0 sm:right-auto">
                                    <Calendar
                                        mode="single"
                                        selected={filterFrom}
                                        onSelect={(date) => {
                                            setFilterFrom(date);
                                            setShowFromCalendar(false);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <span className="font-medium text-sm sm:text-base">Filter to</span>
                        <div className="relative w-full sm:w-[200px]" ref={toCalendarRef}>
                            <input 
                                className="w-full h-[48px] sm:h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-sm sm:text-base md:text-xl pr-10 cursor-pointer" 
                                type="text"
                                value={formatDateInput(filterTo)}
                                onClick={() => setShowToCalendar(!showToCalendar)}
                                placeholder="yyyy-mm-dd"
                                readOnly
                            />
                            <svg 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70 pointer-events-none"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {showToCalendar && (
                                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-primary/50 rounded shadow-lg sm:left-0 right-0 sm:right-auto">
                                    <Calendar
                                        mode="single"
                                        selected={filterTo}
                                        onSelect={(date) => {
                                            setFilterTo(date);
                                            setShowToCalendar(false);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                            variant="primary" 
                            className="h-[48px] sm:h-[54px] px-4 sm:px-6 flex-1 sm:flex-none text-sm sm:text-base"
                            onClick={handleFilter}
                        >
                            Filter
                        </Button>

                        <Button 
                            variant="outline" 
                            className="h-[48px] sm:h-[54px] px-4 sm:px-6 bg-gray-200 hover:bg-gray-300 flex-1 sm:flex-none text-sm sm:text-base"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Show and Search Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base">Show</span>
                        <select 
                            className="h-[40px] bg-white border border-primary/50 focus:outline-none p-2 text-sm sm:text-lg" 
                            value={itemsPerPage} 
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm sm:text-base">entries</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm sm:text-base">Search:</span>
                        <input 
                            className="h-[40px] bg-white border border-primary/50 focus:outline-none p-2 text-sm sm:text-lg flex-1 sm:min-w-[200px]" 
                            type="text"
                            value={voucherSearch} 
                            onChange={(e) => {
                                setVoucherSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {errorMessage !== "" && <span className="text-[red] text-sm sm:text-base">{errorMessage}</span>}
                
                {refundMessage && (
                    <div className={`p-3 rounded text-sm sm:text-base w-full ${refundMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {refundMessage.text}
                    </div>
                )}
                
                {isAdmin === false && (
                    <div className="w-full flex justify-center items-center py-20">
                        <span className="text-lg text-primary/70">You do not have permission to view this page.</span>
                    </div>
                )}
                
                {isAdmin === true && loading ? (
                    <div className="w-full flex justify-center items-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                            <span className="text-lg text-primary/70">Loading vouchers...</span>
                        </div>
                    </div>
                ) : isAdmin === true && !loading ? (
                    <>
                        {showVouchers()}
                        {showPagination()}
                    </>
                ) : null}
            </div>

        </div>
    )
}
