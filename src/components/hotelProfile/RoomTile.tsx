import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingPopUp } from "@/components/LoadingPopUp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";
import ErrorPopUp from "../general/ErrorPopUp";
import { motion, AnimatePresence } from "framer-motion"
import { Amenities } from "./Amenities";
import isEqual from "lodash/isEqual";

interface RoomTileProps{
    rateObj:any
    images:any[]
    rooms:any[]
    
}

export const RoomTile = (props:RoomTileProps) => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [roomImages, setRoomImages] = useState<any[]>([]);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0)


    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState<any>(false);

    const [showError, setShowError] = useState<any>(false);

    useEffect(() => {
    if(auth){
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedIn(true)
        }else{
            setLoggedIn(false)
        }
        })
        return () => unsubscribe();
    }
}, [auth]);// eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        
        let roomName = props.rateObj.room_data_trans.main_name

        let rg_ext = props.rateObj.rg_ext

        let images = props.images.filter(item => isEqual(item.rg_ext,rg_ext));
        if(images.length===0){
            images = props.images.filter(item => item.title === roomName);
        }

        setIndex(0)
        setRoomImages(images)
    }, [props.rateObj.book_hash])

    const showImage = () => {


        let image = roomImages.length>0?roomImages[index]:props.images[0]


        let imageUrl = image.url
        let newURL = imageUrl.replace('{size}','x500')
        return newURL
    }

    // const changeImage = (dir: number) => {
    //     setDirection(dir)
    //     let newIndex = index + dir
    //     if (newIndex < 0) newIndex = props.images.length - 1
    //     else if (newIndex === props.images.length) newIndex = 0
    //     setIndex(newIndex)
    // }

    
    const changeImage = (direction:number) => {

        setDirection(direction)
        let newIndex = index + direction
        if(newIndex<0){newIndex = roomImages.length-1}
        else if(newIndex===roomImages.length){newIndex = 0}
        setIndex(newIndex)
    }



    const prebookRoom = async () => {

        setLoading(true)
        
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

        console.log("PRE BOOK RES",data)        


        if(data.error){
            setShowError(true)
        }else{
            let priceChanged = data.data.changes.price_changed

            if(priceChanged){
                setShowError(true)
            }else{
                let bookHash = data.data.hotels[0].rates[0].book_hash
                createBookingRateHawk(bookHash)
            }
        }


        
        
    }

    const createBookingRateHawk = async (bookHash:string) => {
        
        const hid = searchParams.get('hid');


        const res = await fetch("/api/ratehawk/booking/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
                hashID: bookHash,
                hid:hid,

            }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        let status = data.status

        if(status === "ok")
        {

            let orderID = data.data.order_id
            let partnerID = data.data.partner_order_id
            // let amount = data.data.payment_types[0].amount

            let amount = +getRate()

            let currencyCode = data.data.payment_types[0].currency_code


            

            createBooking(orderID,partnerID,amount,currencyCode)
        }
        
    }

    const createBooking = async (orderID:number,partnerID:string,amount:number,currencyCode:string) => {
        
        const hid = searchParams.get('hid');

        const checkIn = searchParams.get('check-in');
        const checkOut = searchParams.get('check-out');

        const rooms = (searchParams.has('rooms')?JSON.parse(searchParams.get('rooms')||""):[]);


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
                    rooms:rooms,
                    amount:amount,
                    ratehawkAmount: props.rateObj.payment_options.payment_types[0].amount,
                    currencyCode: currencyCode,
                    roomName:props.rateObj.room_name,//props.rateObj.room_data_trans.main_name,
                    amenities:props.rateObj.amenities_data,
                    tax_data:props.rateObj.payment_options.payment_types[0].tax_data.taxes
                }
            }),
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        setLoading(false)
       
        if(!data.error){
            bookRoom(orderID)
        }
        
        
    }

    const bookRoom = (orderID:number) => {

        router.push(`/booking?order=${orderID}`)
    }

    const getCancellationDate = () => {
        let cancellationBefore = props.rateObj.payment_options.payment_types[0].cancellation_penalties.free_cancellation_before
        if(cancellationBefore){

            let formattedDate = formatDate(cancellationBefore)
            return "Full refund before " + formattedDate + " GMT"
        }
        else{
            return "No refund"
        }
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);

        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "short" }); // "Oct"

        // add ordinal suffix (st, nd, rd, th)
        const suffix =
            day % 10 === 1 && day !== 11 ? "st" :
            day % 10 === 2 && day !== 12 ? "nd" :
            day % 10 === 3 && day !== 13 ? "rd" :
            "th";

        return `${day}${suffix} ${month}`;
    }

    const getExtras = () => {
        let meal = props.rateObj.meal
        if(meal === null || meal === "nomeal"){return "Room Only"}
        else{
            return meal + " included"
        }
    }

    const getRate = () => {

    

           
            let price = +props.rateObj.payment_options.payment_types[0].show_amount
            let tax_data = props.rateObj.payment_options.payment_types[0].tax_data.taxes
                
          
            let preTax = price
            tax_data.forEach((element: { included_by_supplier: any; amount: string | number }) => {
                    if(element.included_by_supplier){
                        preTax-= (+element.amount)
                    }
                });

            let commissionPercentage = auth?.currentUser?15:20
            let commission = preTax*(commissionPercentage/100)
            
            
            return (price+commission).toFixed(0)
        
    
    }

    const getRoomAmenityData = () => {
        let list:string[] = []

        props.rateObj.amenities_data.forEach((element: string) => {
            list.push(prettify(element))
        });

        props.rateObj.serp_filters.forEach((element: string) => {
            list.push(prettify(element))
        });

        let rg_ext = props.rateObj.rg_ext
        let rooms = props.rooms.filter(item => isEqual(item.rg_ext,rg_ext));

        if(rooms.length>0){
            let staticAmenities = rooms[0].amenities.split(',')
            staticAmenities.forEach((element: string) => {
                list.push(prettify(element))
            });
        }


        //PRIORITISE CONFLICTS
        if(list.includes("No-window") && list.includes("Window")){
            list = list.filter(item => item !== "Window");
        }

        if(list.includes("Non-smoking") && list.includes("Smoking")){
            list = list.filter(item => item !== "Smoking");
        }

        if(list.includes("External-private-bathroom") && list.includes("Private-bathroom")){
            list = list.filter(item => item !== "Private-bathroom");
        }

        if(list.includes("Shared-bathroom") && (list.includes("External-private-bathroom") || list.includes("Private-bathroom"))){
            list = list.filter(item => item !== "External-private-bathroom");
            list = list.filter(item => item !== "Private-bathroom");
        }

        return list
    }

    function prettify(text: string) {
        return text
            .replace(/_/g, " ")             // replace underscores with spaces
            .split(" ")                     // split into words
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) // capitalize
            .join(" ");
        }

    return(
        <div className="w-[375px] flex flex-col items-center gap-3.5">

            {loading && <LoadingPopUp title="Please wait a moment…" subtitle="Loading your booking request."/>}

            {showError && <ErrorPopUp 
                title="Error booking room" 
                subtitle="There was an issue when trying to create the booking. Perhaps the reate is no longer available. Please try again or refresh the page to view latest available rates" 
                close={()=>setShowError(false)}
                buttonText="Refresh page"
                buttonClicked={()=>window.location.reload()}
                
            />}


            <div className="w-full p-[20px] rounded-[20px] flex flex-col gap-[22px] border border-muted">
                
                <div className="w-full flex flex-col gap-4 h-[400px]">
                    <div className="relative w-full h-[225px] overflow-hidden rounded-[12px]">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.img
                            key={index}
                            src={showImage()}
                            custom={direction}
                            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-full h-full object-cover object-center"
                            />
                        </AnimatePresence>

                        {/* Left Arrow */}
                        <div
                            className="h-[42px] w-[42px] absolute z-10 left-3 top-1/2 -translate-y-1/2 bg-light/78 rounded-[10px] p-[5px] cursor-pointer"
                            onClick={() => changeImage(-1)}
                        >
                            <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M25.002 16.0001C25.002 16.5523 24.5547 17.0001 24.002 17.0001H9.8672L14.8301 24.4454C15.1367 24.9049 15.0127 25.526 14.5528 25.8321C14.3818 25.9459 14.1895 26.0001 13.999 26.0001C13.6758 26.0001 13.3584 25.8438 13.166 25.5548L6.7959 16.0001L13.166 6.44538C13.4717 5.98538 14.0908 5.86088 14.5527 6.16808C15.0127 6.47428 15.1367 7.09528 14.83 7.55478L9.8672 15.0001H24.002C24.5547 15.0001 25.002 15.4479 25.002 16.0001Z"
                                fill="#333337"
                            />
                            </svg>
                        </div>

                        {/* Right Arrow */}
                        <div
                            className="h-[42px] w-[42px] absolute z-10 right-3 top-1/2 -translate-y-1/2 bg-light/78 rounded-[10px] p-[5px] cursor-pointer"
                            onClick={() => changeImage(1)}
                        >
                            <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M6.998 15.9999C6.998 15.4477 7.4453 14.9999 7.998 14.9999L22.1328 14.9999L17.1699 7.55462C16.8633 7.09512 16.9873 6.47402 17.4472 6.16792C17.6182 6.05412 17.8105 5.99992 18.001 5.99992C18.3242 5.99992 18.6416 6.15622 18.834 6.44522L25.2041 15.9999L18.834 25.5546C18.5283 26.0146 17.9092 26.1391 17.4473 25.8319C16.9873 25.5257 16.8633 24.9047 17.17 24.4452L22.1328 16.9999L7.998 16.9999C7.4453 16.9999 6.998 16.5521 6.998 15.9999Z"
                                fill="#333337"
                            />
                            </svg>
                        </div>
                    </div>
                    <span className="text-xl font-medium select-none line-clamp-2">
                        {props.rateObj.allotment>1?props.rateObj.allotment+" ":""}
                        {/* {props.rateObj.room_data_trans.main_name} */}
                        {props.rateObj.room_name}
                        {props.rateObj.allotment>1?"s":""}
                    </span>
                    <div className="max-h-[100px] overflow-scroll">
                        <Amenities amenityList={getRoomAmenityData()} source="roomTile"/>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full flex flex-col ai-start gap-3.5">
                    <span className="font-medium text-lg">Cancellation policy</span>
                    <div className="w-full flex flex-row items-center gap-2 rounded-[10px] p-[10px] bg-alt/5">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.25" y="0.25" width="14.5" height="14.5" rx="7.25" stroke="#333337" stroke-opacity="0.2" stroke-width="0.5"/>
                            <circle cx="7.5" cy="7.5" r="4.5" fill="#333337"/>
                        </svg>
                        <span className="text-normal">{getCancellationDate()}</span>
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
                        <span className="text-lg">{getExtras()}</span>
                    </div>
                </div>

                <div className="w-full h-px bg-alt/10"/>

                <div className="w-full justify-between ai-end text-lg flex flex-row">
                    <div className="flex flex-row">
                        <span className="font-medium">€{Number((+(getRate())/props.rateObj.daily_prices.length).toFixed(2)).toLocaleString()}/</span>
                        <span>night</span>
                    </div>
                    <div className="flex flex-row items-end gap-1.5">
                        <span className="text-2xl font-medium">€{Number((+getRate()).toFixed(0)).toLocaleString()}</span>
                        <span>{"(total)"}</span>
                    </div>
                </div>

                <Button className="bg-accent hover:bg-accent/90 text-light text-lg font-bold h-[54px]" onClick={prebookRoom}>BOOK</Button>

            </div>

            {!loggedIn && <div className="flex flex-row items-center gap-2.5">
                {/* <div className="w-px h-[50px] bg-primary"/> */}
                <Button className="bg-[#d5b18d] hover:bg-[#d5b18d]/90 text-light font-medium" onClick={()=>router.push('/login')}>Sign in for member discounts</Button>
            </div>}
        </div>
    )
}