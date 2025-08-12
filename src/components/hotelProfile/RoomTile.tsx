import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation";

interface RoomTileProps{
    rateObj:any
    images:any[]
}

export const RoomTile = (props:RoomTileProps) => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [roomImages, setRoomImages] = useState<any[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        
        let roomName = props.rateObj.room_data_trans.main_name

        let images = props.images.filter(item => item.title === roomName);
        setRoomImages(images)
    }, [])

    const showImage = () => {

        let image = roomImages.length>0?roomImages[index]:props.images[0]

        let imageUrl = image.url
        let newURL = imageUrl.replace('{size}','240x240')
        return newURL
    }

    const changeImage = (direction:number) => {

        let newIndex = index + direction
        if(newIndex<0){newIndex = roomImages.length-1}
        else if(newIndex===roomImages.length){newIndex = 0}
        setIndex(newIndex)
    }



    const prebookRoom = async () => {
        
        const res = await fetch("/api/ratehawk/booking/prebook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
                hashID: props.rateObj.book_hash
            }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();


        let priceChanged = data.data.changes.price_changed

        if(priceChanged){

        }else{
            let bookHash = data.data.hotels[0].rates[0].book_hash
            createBookingRateHawk(bookHash)
        }
        
    }

    const createBookingRateHawk = async (bookHash:string) => {
        
        const res = await fetch("/api/ratehawk/booking/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
                hashID: bookHash
            }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        let status = data.status

        if(status === "ok")
        {

            let orderID = data.data.order_id
            let partnerID = data.data.partner_order_id
            let amount = data.data.payment_types[0].amount
            let currencyCode = data.data.payment_types[0].currency_code

            createBooking(orderID,partnerID,amount,currencyCode)
        }
        
    }

    const createBooking = async (orderID:number,partnerID:string,amount:number,currencyCode:string) => {
        
        const hid = searchParams.get('hid');

        const checkIn = searchParams.get('check-in');
        const checkOut = searchParams.get('check-out');

        const adults = +(searchParams.get('adults')||1);
        const children = +(searchParams.get('children')||1);

        const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
                bookingData:{
                    orderID:orderID,
                    partnerID:partnerID,
                    hid:hid,
                    checkIn:checkIn,
                    checkOut:checkOut,
                    adults:adults,
                    children:children,
                    amount:amount,
                    currencyCode: currencyCode,
                    roomName:props.rateObj.room_data_trans.main_name,
                    amenities:props.rateObj.amenities_data
                }
            }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

       
        bookRoom(orderID)
        
        
    }

    const bookRoom = (orderID:number) => {

        router.push(`/booking?order=${orderID}`)//&hid=${hid}&check-in=${checkIn}&check-out=${checkOut}&adults=${adults}&children=${children}`)
    }

    return(
        <div className="w-[375px] flex flex-col items-center gap-3.5">
            <div className="w-full p-[20px] rounded-[20px] flex flex-col gap-[22px] border border-muted">
                
                <div className="w-full flex flex-col gap-4 h-[300px]">
                    <div className="relative w-full h-[225px]">
                        <img className="w-full h-full" src={showImage()}/>
                        <div className="h-[42px] w-[42px] absolute z-5 left-3 top-1/2 bg-light/78 rounded-[10px] p-[5px] cursor-pointer" onClick={()=>changeImage(-1)}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.002 16.0001C25.002 16.5523 24.5547 17.0001 24.002 17.0001H9.8672L14.8301 24.4454C15.1367 24.9049 15.0127 25.526 14.5528 25.8321C14.3818 25.9459 14.1895 26.0001 13.999 26.0001C13.6758 26.0001 13.3584 25.8438 13.166 25.5548L6.7959 16.0001L13.166 6.44538C13.4717 5.98538 14.0908 5.86088 14.5527 6.16808C15.0127 6.47428 15.1367 7.09528 14.83 7.55478L9.8672 15.0001H24.002C24.5547 15.0001 25.002 15.4479 25.002 16.0001Z" fill="#333337"/>
                            </svg>
                        </div>
                        <div className="h-[42px] w-[42px] absolute z-5 right-3 top-1/2 bg-light/78 rounded-[10px] p-[5px] cursor-pointer" onClick={()=>changeImage(1)}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.998 15.9999C6.998 15.4477 7.4453 14.9999 7.998 14.9999L22.1328 14.9999L17.1699 7.55462C16.8633 7.09512 16.9873 6.47402 17.4472 6.16792C17.6182 6.05412 17.8105 5.99992 18.001 5.99992C18.3242 5.99992 18.6416 6.15622 18.834 6.44522L25.2041 15.9999L18.834 25.5546C18.5283 26.0146 17.9092 26.1391 17.4473 25.8319C16.9873 25.5257 16.8633 24.9047 17.17 24.4452L22.1328 16.9999L7.998 16.9999C7.4453 16.9999 6.998 16.5521 6.998 15.9999Z" fill="#333337"/>
                            </svg>
                        </div>
                    </div>
                    <span className="text-xl font-medium select-none">{props.rateObj.room_data_trans.main_name}</span>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full flex flex-col ai-start gap-3.5">
                    <span className="font-medium text-lg">Cancellation policy</span>
                    <div className="w-full flex flex-row items-center gap-2 rounded-[10px] p-[10px] bg-alt/5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="14.5" height="14.5" rx="7.25" stroke="#333337" stroke-opacity="0.2" stroke-width="0.5"/>
                            <circle cx="7.5" cy="7.5" r="4.5" fill="#333337"/>
                        </svg>
                        <span className="text-lg">Full refund before 3 Aug</span>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full flex flex-col ai-start gap-3.5">
                    <span className="font-medium text-lg">Extras</span>
                    <div className="w-full flex flex-row items-center gap-2 rounded-[10px] p-[10px] bg-alt/5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="14.5" height="14.5" rx="7.25" stroke="#333337" stroke-opacity="0.2" stroke-width="0.5"/>
                            <circle cx="7.5" cy="7.5" r="4.5" fill="#333337"/>
                        </svg>
                        <span className="text-lg">Room Only</span>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full justify-between ai-end text-lg flex flex-row">
                    <div className="flex flex-row">
                        <span className="font-medium">€{(+props.rateObj.daily_prices[0]).toFixed(0)}/</span>
                        <span>night</span>
                    </div>
                    <div className="flex flex-row items-end">
                        <span className="text-2xl font-medium">€{+(props.rateObj.payment_options.payment_types[0].show_amount)}</span>
                        <span>{"(total)"}</span>
                    </div>
                </div>

                <Button className="bg-accent text-light text-lg font-bold h-[54px]" onClick={prebookRoom}>BOOK</Button>

            </div>

            <div className="flex flex-row items-center gap-2.5">
                <div className="w-px h-[50px] bg-primary"/>
                <Button className="bg-[#A38561] text-light font-medium">Sign in for member discounts</Button>
            </div>
        </div>
    )
}