import { useState } from "react";
import { Button } from "../ui/button"


export const VoucherApply = () => {

    const [voucherCode, setVoucherCode] = useState<string>("");

    return(
        <div className="flex flex-col gap-[30px] w-full border border-primary/50 p-[33px]">

            <div className="w-full flex flex-col items-start gap-4">
                <span className="text-lg font-bold">Do you have a Voucher Code?</span>
                <div className="w-full p-[9px] border border-primary/30 flex flex-row item-center">
                    <input 
                        className="w-full h-stretch bg-transparent border-none focus:outline-none" 
                        type="text"
                        placeholder="Example: XYZ12345" 
                        value={voucherCode} 
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <Button className="bg-accent p-[12px] font-medium text-lg">APPLY</Button>
                </div>
            </div>

            <div className="w-full bg-muted/50 p-[18px] flex flex-col gap-5 text-lg font-bold">

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-medium">Booking Total</span>
                    <span>£9347.26</span>
                </div>

                <div className="w-full h-px border-t border-dashed border-primary/50"/>

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-normal">Gift card total:</span>
                    <span>£0</span>
                </div>

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-normal">Remainder Payable</span>
                    <span>£9347.26</span>
                </div>
            </div>

        </div>
    )
}