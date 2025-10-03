"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Vouchers() {

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherError,setVoucherError] = useState<string>("");
    const [voucherApplied,setVoucherApplied] = useState<any>(null);


    const applyVoucher = async () => {

        var amount = 0
        var found = false

        setVoucherError("")
        setVoucherApplied(null)

        const res = await fetch(`/api/vouchers/validate?voucherID=${voucherCode}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        found = data.found


        if(!found){setVoucherError("Invalid Voucher Code")}
        else{
            amount = +data.voucher.balance
            setVoucherApplied(data.voucher)
        }
    }

    const formatDate = (date:string) => {

        let split = date.split("-")
        return split[2]+'-'+split[1]+'-'+split[0]
    }
    

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

            <div className="flex flex-col gap-1.5 ai-start min-w-[400px]">
                <span className="font-medium">Voucher Code*</span>

                <div className="w-full flex flex-row items-center gap-5">
                    <input 
                        className="w-full h-[54px] bg-white border border-primary/50 focus:outline-none p-[10px] text-xl" 
                        type="text"
                        value={voucherCode} 
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    {/* <Button onClick={applyVoucher}>CHECK BALANCE</Button> */}

                    <Button className="bg-accent hover:bg-accent/9" onClick={applyVoucher}>CHECK BALANCE</Button>

                </div>

                
                {voucherApplied && <div className="flex flex-col gap-2">
                    <div className="flex flex-row text-lg gap-2">
                        <span>Remaining balance:</span>
                        <span className="font-bold">£{voucherApplied.balance}</span>
                    </div>

                    <div className="flex flex-row text-lg gap-2">
                        <span>Expiry date:</span>
                        <span className="font-bold">{formatDate(voucherApplied.expiry_date)}</span>
                    </div>
                </div>}

                {voucherError && <span className="text-[red]">{voucherError}</span>}

            </div>


    </div>)

}