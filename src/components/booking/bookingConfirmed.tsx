import { Button } from "../ui/button"
import { useRouter } from "next/navigation";

export const BookingConfirmed = () => {

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

            <span className="text-9xl" style={{fontFamily:'Harlow'}}>Thank You</span>

            <div className="text-2xl flex flex-col items-center gap-5">
                <span>Your booking is confirmed</span>
                <span>A confirmation email has been sent to:</span>
                <span className="text-accent font-medium">user@example.com</span>
            </div>

            <div className="flex flex-row gap-5 mt-4">
                <Button className="bg-accent text-lg font-bold p-4">MANAGE YOUR BOOKING</Button>
                <Button className="bg-light text-lg text-accent font-bold p-4 border border-accent" onClick={()=>router.push(`/home`)}>GO TO HOMEPAGE</Button>
            </div>
        </div>
    )
}