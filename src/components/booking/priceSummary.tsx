import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface PriceSummaryProps {
    booking:any
    amountToCharge:number
}


export const PriceSummary = (props:PriceSummaryProps) => {

    const amountOfDays = () => {
        const checkIn = new Date(props.booking.check_in);
        const checkOut = new Date(props.booking.check_out);

        const diffTime = checkOut.getTime() - checkIn.getTime(); // milliseconds difference
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // convert to days

        return diffDays + (diffDays>1?" nights":" night")

    }

    const showTaxes = () => {
        const compArray:any[] = []
        props.booking.tax_data.forEach((element: { included_by_supplier: any; amount: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
            if(element.included_by_supplier){
                compArray.push(<span>+€{element.amount}</span>)
            }
        });
        return compArray
    }

    const calculatePreTaxPrice = () => {
        var amount = props.booking.amount
        props.booking.tax_data.forEach((element: { included_by_supplier: any; amount: string ; }) => {
            if(element.included_by_supplier){
                amount -= (+element.amount)
            }
        });
        return amount
    }

    return(
        <div className="flex flex-col items-start border border-primary/50 py-[21px] gap-5 min-w-100 max-w-[575px]">

            <span className="px-[28px] text-4xl" style={{fontFamily:'Harlow'}}>Your price summary</span>
            
            <div className="px-[28px] text-lg w-full flex justify-between">
                <span>{props.booking.room_name}</span>
                <span>€{calculatePreTaxPrice()}</span>
            </div>

            <div className="px-[28px] text-lg w-full flex justify-between">
                <span>Taxes & fees</span>
                {showTaxes()}
            </div>

            {props.booking.amount !== props.amountToCharge && <div className="px-[28px] text-lg w-full flex justify-between">
                <span>Voucher</span>
                <span>-€{(+props.booking.amount) - (+props.amountToCharge)}</span>
            </div>}

            <div className="px-[28px] py-[13px] w-full flex justify-between items-center bg-muted">
                <div className="flex flex-col items-start">
                    <span className="font-medium">Price</span>
                    <span>{`(for ${amountOfDays()} & all guests)`}</span>
                </div>
                <span className="text-lg">£{+props.booking.amount + 0 - ((+props.booking.amount) - (+props.amountToCharge))}</span>
            </div>

            <div className="px-[28px] flex flex-row item-start gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.25 4.5L10.125 11.625L6.375 7.875L0.75 13.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.75 4.5H17.25V9" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <span className="font-medium">This price may increase if you book later</span>
            </div>

        </div>
    )
}