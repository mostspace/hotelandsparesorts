import { MapProvider } from "@/providers/map-provider"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import PlacesAutocomplete from "../maps/autocomplete"
import { useState } from "react"
import { useRouter } from "next/navigation";

export interface HotelTileProps{
    hotel:any
    checkIn:string
    checkOut:string
    rooms?:any[]
    source:string
    booking?:any
    locationName:string
    showDiscount?:boolean
}

export const HotelTile = (props:HotelTileProps) => {

    const [status, setStatus] = useState<string>(props.booking?props.booking.status:"");


    console.log("HT ROOMs",props.rooms)

    const router = useRouter();
    
    
    const getImageURL = () => {

        var imageUrl 

        if(props.hotel.images.length > 0)
        {
            const exterior = props.hotel.images.filter((img: { title: string }) => img.title === "exterior");
            const lobby = props.hotel.images.filter((img: { title: string }) => img.title === "lobby");

            if(exterior.length>0){imageUrl = exterior[0].url}
            else if(lobby.length>0){imageUrl = lobby[0].url}
            else{imageUrl = props.hotel.images[0].url}
            
            return imageUrl.replace('{size}','x500')
        }else{
            return ""
        }
    }

    const getRate = (commissionPercentage:number) => {

        if(props.source.includes("Bookings")){
            return +props.booking.amount
        }else{

            let lowestRate:any = null 
            let lowestTaxData:any =null
            let tax:number = 0
            

            let rates:any[] = props.hotel.rates
            rates.forEach(rate => {
                let price = rate.payment_options.payment_types[0].show_amount
                let tax_data = rate.payment_options.payment_types[0].tax_data.taxes
                

                if(!lowestRate || +price<lowestRate){
                    lowestRate = +price
                    lowestTaxData = tax_data
                }
            });

            let preTax = lowestRate
            lowestTaxData.forEach((element: { included_by_supplier: any; amount: string | number }) => {
                    if(element.included_by_supplier){
                        preTax-= (+element.amount)
                    }
                });

            let commission = preTax*(commissionPercentage/100)
            
            
            return (lowestRate+commission).toFixed(0)
        }
    
    }

    const showStars = () => {
        let compArray:any[] = []

        let stars = props.hotel.star_rating || 5

        for(var i=0; i<stars; i++){
            compArray.push(<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                <path d="M8.63017 0L10.5678 5.9633L16.838 5.9633L11.7653 9.64883L13.7029 15.6121L8.63017 11.9266L3.55749 15.6121L5.49508 9.64883L0.422391 5.9633L6.69258 5.9633L8.63017 0Z" fill="#A56658"/>
              </svg>)
        }

        return compArray
    }

    const calculateNights = () => {
        const checkIn = new Date(props.checkIn);
        const checkOut = new Date(props.checkOut);

        const diffInTime = checkOut.getTime() - checkIn.getTime();
        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

        return diffInDays
    }

    const openHotel = (hid:number) => {


        let url = `/hotel-profile?hid=${hid}&check-in=${props.checkIn}&check-out=${props.checkOut}&rooms=${JSON.stringify(props.rooms)}&location=${props.locationName}`
        window.open(url, "_blank");

    }

    const formatDate = (dateStr:string) => {
        const date = new Date(dateStr);

        const formatted = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        
        return (formatted); // Wed, Oct 15, 2025
    }

    const refundStripe = async () => {
        try {
            const res = await fetch("/api/stripe/refunds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentID: props.booking.stripe_id}),
            });
        
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        
            const data = await res.json();
            console.log("REFUND DATA",data)
            updateStatus("Payment Refunded")


        } catch (error) {
            console.error("API POST call failed:", error);
        }
    }

     const refundVoucher = async () => {

        let overallAmount = +props.booking.amount
        let amountPaid = +props.booking.amount_paid

        try {
            const res = await fetch("/api/vouchers/refund", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ voucherCode: props.booking.voucher_used,amount:overallAmount-amountPaid}),
            });
        
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        
            const data = await res.json();
            console.log("REFUND DATA",data)
            updateStatus("Voucher Refunded")

        } catch (error) {
            console.error("API POST call failed:", error);
        }
    }

    const updateStatus = async (action:string) => {
        

        try {
            const res = await fetch(`/api/bookings/${props.booking.order_id}/status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action}),
            });
        
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        
            const data = await res.json();
            console.log("STATUS DATA",data)

            setStatus(data.status)

        } catch (error) {
            console.error("API POST call failed:", error);
        }
    }

    return(
    <div className={`w-full ${props.source==="AllBookings"?"md:h-[500px]":"md:h-[300px]"} flex md:flex-row flex-col border border-primary text-primary bg-light`}>

        <img className="md:h-full h-[200px] md:w-[40%] lg:w-[30%] object-cover object-center" src={getImageURL()} />
        
        <div className="md:flex-1 w-[100%] h-full flex flex-col justify-between md:p-6 p-2">

            <div className="w-full flex flex-col gap-2.5">
                
                <div className="flex md:flex-row flex-col-reverse justify-between md:items-center items-end">
                    
                    <div className="flex flex-row gap-3 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none">
                            <path d="M12.3636 6.18182C12.3636 2.75758 9.60606 0 6.18182 0C2.75758 0 0 2.75758 0 6.18182C0 9.60606 6.18182 16 6.18182 16C6.18182 16 12.3636 9.60606 12.3636 6.18182ZM3.30303 6.06061C3.30303 4.48485 4.60606 3.18182 6.18182 3.18182C7.75758 3.18182 9.06061 4.45455 9.06061 6.06061C9.06061 7.63636 7.78788 8.9394 6.18182 8.9394C4.60606 8.9394 3.30303 7.63636 3.30303 6.06061Z" fill="#4D4D4D"/>
                        </svg>
                        <span className="md:text-lg">{props.hotel.address}</span>
                    </div>

                    <div className="w-[130px] flex flex-row gap-2 justify-start">
                    {showStars()}
                    </div>
                </div>
                <span className="md:text-4xl text-2xl md:font-normal font-medium" style={{fontFamily:'Harlow'}}>{props.hotel.hotel_name}</span>
            </div>  


            <div className={`flex md:flex-row flex-col-reverse justify-between items-end w-full gap-4`}>
                
                {!props.source.includes("Bookings")&&<Button onClick={()=>openHotel(props.hotel.hid)} className="bg-accent hover:bg-accent/90 text-light text-lg">VIEW DETAILS & BOOK</Button>}
                {props.source.includes("Bookings")&&
                    <div className="flex flex-col items-start gap-2 text-alt">
                        <span className="text-lg"><strong>Check-In:</strong> {formatDate(props.checkIn)}</span>
                        <span className="text-lg"><strong>Check-Out:</strong> {formatDate(props.checkOut)}</span>
                        <span className="text-lg"><strong>Booking Num:</strong> {props.booking.order_id}</span>
                    </div>
                }

                <div className="flex flex-col items-end gap-2 text-alt">
                    {props.source!=="MyBookings" && <div className="flex gap-2 items-end">
                        <span className={`text-3xl font-medium ${props.showDiscount?"line-through text-primary/50":""}`}>€{getRate(20)}</span> 
                        {props.showDiscount && <span className="text-3xl font-medium">€{(+getRate(15)).toFixed(2)}</span> }
                    </div>}
                    <div className="flex flex-col items-end gap-2 text-alt">
                        <span className="md:text-lg">{props.rooms?.length} room, {calculateNights()} nights</span>
                        <span className="text-accent text-sm">Fully refundable</span>
                     </div>
                </div>
            </div>
               


            {props.source === "AllBookings" && <div className="flex flex-col gap-3">
                
                <span className="font-bold text-xl underline">Admin Tools</span>
                <div className="flex flex-col items-start gap-2 text-alt">
                    <span className="text-lg"><strong>User:</strong> {props.booking.user?props.booking.user.email:"N/A"}</span>
                    <span className="text-lg"><strong>Status: </strong>{status}</span>
                    <span className="text-lg"><strong>Voucher Used: </strong>{props.booking.voucher_used || "N/A"}</span>
                    <span className="text-lg"><strong>Amount Paid (after voucher): </strong>{props.booking.amount_paid}</span>
                </div>

                <div className="flex gap-4">
                    <Button 
                        disabled={props.booking.amount_paid === 0 || !props.booking.stripe_id || status.includes("Payment Refunded")} 
                        onClick={refundStripe}>
                            Refund Stripe
                    </Button>
                    <Button 
                        className="bg-accent hover:bg-accent/90" 
                        disabled={(!props.booking.voucher_used) || status.includes("Voucher Refunded") || status.includes("Voucher and Payment Refunded")} 
                        onClick={refundVoucher}>
                            Refund Voucher 
                    </Button>
                </div>
            </div>}       
            

        </div>

    </div>
    )

}