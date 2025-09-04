import { auth } from "@/app/firebase";
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";

interface BookingConfirmedProps {
    email:string,
    bookingNumber:string
}

export const BookingConfirmed = (props:BookingConfirmedProps) => {

    const router = useRouter();

    return(
        <div className="w-full h-full flex flex-col items-center gap-10">

            <div className="w-[96px] h-[96px] bg-accent rounded-full flex justify-center items-center">
                <svg width="51" height="42" viewBox="0 0 51 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_117_1209)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1194 29.7783L5.3858 18.258L1.47461 22.0981L17.1194 37.4584L50.6439 4.54348L46.7327 0.7034L17.1194 29.7783Z" fill="white"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_117_1209">
                    <rect width="50.2867" height="41.1437" fill="white" transform="translate(0.357422 0.429108)"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>

            <span className="text-9xl text-center" style={{fontFamily:'Harlow'}}>Thank You</span>

            <div className="text-2xl flex flex-col items-center gap-5">
                <span>Your booking is confirmed</span>
                <span>Booking Number: {props.bookingNumber}</span>
                <span>A confirmation email has been sent to:</span>
                <span className="text-accent font-medium">{props.email}</span>
            </div>

            <div className="flex flex-row gap-5 mt-4">
                {auth?.currentUser && <Button className="bg-accent text-lg font-bold p-4" onClick={()=>router.push(`/user/my-bookings`)}>MANAGE YOUR BOOKING</Button>}
                {!auth?.currentUser && <Button className="bg-accent text-lg font-bold p-4" onClick={()=>router.push(`/login?bookingNumber=${props.bookingNumber}`)}>LINK BOOKING TO ACCOUNT</Button>}
                <Button className="bg-light text-lg text-accent font-bold p-4 border border-accent" onClick={()=>router.push(`/`)}>GO TO HOMEPAGE</Button>
            </div>
        </div>
    )
}