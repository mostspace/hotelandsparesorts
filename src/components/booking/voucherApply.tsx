import { useState } from "react";
import { Button } from "../ui/button"

interface VoucherApplyProps {
    amount:number
    setAmount: any
    setVoucherCode:any
}

export const VoucherApply = (props:VoucherApplyProps) => {

    const [voucherCode, setVoucherCode] = useState<string>("");
    const [voucherError,setVoucherError] = useState<string>("");
    const [voucherApplied,setVoucherApplied] = useState<any>(null);

    const validVoucherCodes = [
        {code:"abcd",amount:20},
        {code:"defg",amount:200},
        {code:"fghi",amount:2000},
    ]

    const applyVoucher = () => {

        var amount = 0
        var found = false

        setVoucherError("")

        validVoucherCodes.forEach(option => {
            if(option.code === voucherCode){
                found = true
                amount = option.amount
                setVoucherApplied(option)
            }
        });

        if(!found){setVoucherError("Invalid Voucher Code")}
        else{
            let remainderPayable = calculateNewPrice(amount)
            props.setAmount(remainderPayable)
            props.setVoucherCode(voucherCode)
        }
    }

    const calculateNewPrice = (amount:number) => {

        var newPrice = props.amount-amount
        if(newPrice<0){newPrice=0}
        return newPrice
    }


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
                    <Button className="bg-accent p-[12px] font-medium text-lg" onClick={applyVoucher}>APPLY</Button>
                </div>

                <span className="text-[red]">{voucherError}</span>
                {voucherApplied && <span className="font-medium">Voucher Applied</span>}

            </div>

            <div className="w-full bg-muted/50 p-[18px] flex flex-col gap-5 text-lg font-bold">

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-medium">Booking Total</span>
                    <span>£{props.amount}</span>
                </div>

                <div className="w-full h-px border-t border-dashed border-primary/50"/>

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-normal">Gift card total:</span>
                    <span>£{voucherApplied?voucherApplied.amount:0}</span>
                </div>

                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-normal">Remainder Payable</span>
                    <span>£{calculateNewPrice(voucherApplied?voucherApplied.amount:0)}</span>
                </div>
            </div>

        </div>
    )
}