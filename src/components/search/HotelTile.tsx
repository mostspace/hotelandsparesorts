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
    adults:number
    children:number
}

export const HotelTile = (props:HotelTileProps) => {

    const router = useRouter();
    
    
    const getImageURL = () => {
        let imageUrl = props.hotel.images[0].url
        return imageUrl.replace('{size}','240x240')
    }

    const getRate = () => {
        let rates = props.hotel.rates
        let rate = rates[0]
        let price = rate.payment_options.payment_types[0].show_amount
        return (+price).toFixed(0)
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
        router.push(`/hotel-profile?hid=${hid}&check-in=${props.checkIn}&check-out=${props.checkOut}&adults=${props.adults}&children=${props.children}`)
    }

    return(
    <div className="w-full h-[300px] flex flex-row border border-primary text-primary">

        <img className="h-full w-[40%] max-w-[480px]" src={getImageURL()} />
        
        <div className="w-full h-full flex flex-col justify-between p-6">

            <div className="w-full flex flex-col gap-2.5">
                
                <div className="flex flex-row justify-between items-center">
                    
                    <div className="flex flex-row gap-3 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16" fill="none">
                            <path d="M12.3636 6.18182C12.3636 2.75758 9.60606 0 6.18182 0C2.75758 0 0 2.75758 0 6.18182C0 9.60606 6.18182 16 6.18182 16C6.18182 16 12.3636 9.60606 12.3636 6.18182ZM3.30303 6.06061C3.30303 4.48485 4.60606 3.18182 6.18182 3.18182C7.75758 3.18182 9.06061 4.45455 9.06061 6.06061C9.06061 7.63636 7.78788 8.9394 6.18182 8.9394C4.60606 8.9394 3.30303 7.63636 3.30303 6.06061Z" fill="#4D4D4D"/>
                        </svg>
                        <span className="text-lg">{props.hotel.address}</span>
                    </div>

                    <div className="w-[130px] flex flex-row gap-2 justify-start">
                    {showStars()}
                    </div>
                </div>
                <span className="text-4xl">{props.hotel.hotel_name}</span>
            </div>  


            <div className="flex flex-row justify-between items-end">
                <Button onClick={()=>openHotel(props.hotel.hid)} className="bg-accent text-light">VIEW DETAILS & BOOK</Button>

                <div className="flex flex-col items-end gap-2 text-alt">
                    <span className="text-3xl font-medium">€{getRate()}</span> 
                    <span className="text-lg">1 room, {calculateNights()} nights</span>
                    <span className="text-accent text-sm">Fully refundable</span>
                </div>
            </div>          
            

        </div>

    </div>
    )

}