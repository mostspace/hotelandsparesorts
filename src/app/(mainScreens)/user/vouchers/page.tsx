"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Vouchers() {

    const [voucherCode, setVoucherCode] = useState("");
    

    return(<div className="flex flex-col gap-[50px] items-start">

        <div className="flex flex-col gap-5 items-start text-primary/70 text-lg">
            {/* BREADCRUMBS */}
            <div className="flex flex-row items-center gap-2">
                <span>My Account</span>
                <span>{">"}</span>
                <span>Vouchers</span>
            </div>
            <span className="text-6xl text-accent font-medium">Vouchers</span>
        </div>

        <div className="flex flex-row items-center gap-5">
            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Voucher Code*</span>
                <input 
                    className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                    type="text"
                    value={voucherCode} 
                    onChange={(e) => setVoucherCode(e.target.value)}
                />
                <div className="flex flex-row text-lg gap-2">
                    <span>Remaining balance:</span>
                    <span className="font-bold">£65.00</span>
                </div>

            </div>

            <Button>CHECK BALANCE</Button>
        </div>

    </div>)

}