"use client";

import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AdminVouchers() {

    const [vouchers, setVouchers] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<any>("");
    const [voucherSearch, setVoucherSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        if(auth){
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              retrieveVouchers()
            }
          })
          return () => unsubscribe();
        }
    }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps
    

    const retrieveVouchers = async () => {
        
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
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                // Try parsing as DD-MM-YYYY format
                const parts = dateString.split("-");
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return dateString;
            }
            return date.toLocaleDateString('en-GB');
        } catch {
            return dateString;
        }
    }

    const showVouchers = () => {
        let filteredVouchers = vouchers.slice();

        // Filter by search
        if (voucherSearch) {
            filteredVouchers = filteredVouchers.filter(voucher =>
                voucher.voucher_code?.toLowerCase().includes(voucherSearch.toLowerCase())
            );
        }

        // Filter by type
        const now = new Date();
        if (filterType === 'active') {
            filteredVouchers = filteredVouchers.filter(voucher => {
                const balance = parseFloat(voucher.balance || 0);
                const expiryDate = voucher.expiry_date ? new Date(voucher.expiry_date) : null;
                return balance > 0 && (!expiryDate || expiryDate >= now);
            });
        } else if (filterType === 'expired') {
            filteredVouchers = filteredVouchers.filter(voucher => {
                const expiryDate = voucher.expiry_date ? new Date(voucher.expiry_date) : null;
                return expiryDate && expiryDate < now;
            });
        } else if (filterType === 'used') {
            filteredVouchers = filteredVouchers.filter(voucher => {
                const balance = parseFloat(voucher.balance || 0);
                return balance === 0;
            });
        }

        // Sort by voucher code
        filteredVouchers.sort((a, b) => {
            const codeA = a.voucher_code || '';
            const codeB = b.voucher_code || '';
            return codeA.localeCompare(codeB);
        });

        if (filteredVouchers.length === 0) {
            return <span>No vouchers found.</span>;
        }

        return (
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse border border-primary/50">
                    <thead>
                        <tr className="bg-primary/10">
                            <th className="border border-primary/50 p-3 text-left font-medium">Voucher Code</th>
                            <th className="border border-primary/50 p-3 text-left font-medium">Balance</th>
                            <th className="border border-primary/50 p-3 text-left font-medium">Expiry Date</th>
                            <th className="border border-primary/50 p-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVouchers.map((voucher, index) => {
                            const balance = parseFloat(voucher.balance || 0);
                            const expiryDate = voucher.expiry_date ? new Date(voucher.expiry_date) : null;
                            const isExpired = expiryDate && expiryDate < now;
                            const isUsed = balance === 0;
                            const status = isUsed ? 'Used' : isExpired ? 'Expired' : 'Active';

                            return (
                                <tr key={index} className="hover:bg-primary/5">
                                    <td className="border border-primary/50 p-3 font-mono">{voucher.voucher_code || "N/A"}</td>
                                    <td className="border border-primary/50 p-3">€{balance.toFixed(2)}</td>
                                    <td className="border border-primary/50 p-3">{formatDate(voucher.expiry_date)}</td>
                                    <td className="border border-primary/50 p-3">
                                        <span className={`px-2 py-1 rounded ${
                                            status === 'Active' ? 'bg-green-100 text-green-800' :
                                            status === 'Used' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return(
        <div className="flex flex-col gap-[50px] items-start">

            <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
                {/* BREADCRUMBS */}
                <div className="flex flex-row items-center gap-2">
                    <span>Admin</span>
                    <span>{">"}</span>
                    <span>All Vouchers</span>
                </div>
                <span className="text-6xl text-accent font-medium">All Vouchers</span>

                <div className="flex gap-8 items-end">
                    <div className="flex flex-col gap-1.5 ai-start min-w-[300px]">
                        <span className="font-medium">Search by Voucher Code</span>
                        <input 
                            className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            type="text"
                            value={voucherSearch} 
                            onChange={(e) => setVoucherSearch(e.target.value)}
                            placeholder="Enter voucher code..."
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 ai-start">
                        <span className="font-medium">Filter Status</span>
                        <select 
                            className="w-[200px] h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value={"all"}>All</option>
                            <option value={"active"}>Active</option>
                            <option value={"used"}>Used</option>
                            <option value={"expired"}>Expired</option>
                        </select>
                    </div>
                </div>

                {errorMessage !== "" && <span className="text-[red]">{errorMessage}</span>}
                
                <div className="w-full">
                    {vouchers.length > 0 && (
                        <div className="mb-4 text-lg">
                            <span className="font-medium">Total Vouchers: {vouchers.length}</span>
                        </div>
                    )}
                    {showVouchers()}
                </div>
            </div>

        </div>
    )
}

