"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button"

export const Header = () => {

    const router = useRouter();
    
    const homeClicked = () => {
        router.push(`/home`)
    }

    return <div className="w-full flex flex-col items-start gap-6 px-[120px] py-[52px] text-base font-medium bg-light">

        <div className="w-full flex flex-row justify-between">
            <div className="flex flex-row gap-3">
                <span className="hover:text-accent cursor-pointer">PARTNER SIGN IN</span>
                <div className="h-full w-[1.5px] bg-primary"/>
                <span className="hover:text-accent cursor-pointer">BECOME A PARTNER</span>
            </div>

            <div className="flex flex-row items-center gap-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.6094 12.1875C15.3906 10.9583 15.849 9.5 15.849 7.93229C15.849 3.55208 12.3021 0 7.92708 0C3.54687 0 0 3.55208 0 7.93229C0 12.3125 3.54688 15.8646 7.92188 15.8646C9.51042 15.8646 10.9896 15.3958 12.2292 14.5938L12.5885 14.3437L18.2448 20L20 18.2135L14.349 12.5573L14.6094 12.1875ZM12.3646 3.5C13.5469 4.68229 14.1979 6.25521 14.1979 7.92708C14.1979 9.59896 13.5469 11.1719 12.3646 12.3542C11.1823 13.5365 9.60937 14.1875 7.9375 14.1875C6.26562 14.1875 4.69271 13.5365 3.51042 12.3542C2.32812 11.1719 1.67708 9.59896 1.67708 7.92708C1.67708 6.25521 2.32812 4.68229 3.51042 3.5C4.69271 2.31771 6.26562 1.66667 7.9375 1.66667C9.60937 1.66667 11.1823 2.31771 12.3646 3.5Z" fill="#4D4D4D"/>
                </svg>

                <div className="flex flex-row gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13.3125 3.84375C15.293 3.84375 16.9023 5.45703 16.9023 7.44922C16.9023 8.47266 16.4766 9.39453 15.7969 10.0508L10 15.9023L4.10156 9.94531C3.48438 9.29688 3.10156 8.41797 3.10156 7.44922C3.10156 5.45703 4.70703 3.84375 6.69141 3.84375C8.18359 3.84375 9.46094 4.75781 10.0039 6.0625C10.5391 4.76172 11.8203 3.84375 13.3125 3.84375ZM13.3125 3.24219C11.9922 3.24219 10.7812 3.85938 10 4.875C9.21875 3.85938 8.00781 3.24219 6.6875 3.24219C4.37891 3.24219 2.5 5.12891 2.5 7.44922C2.5 8.53906 2.91406 9.57422 3.66797 10.3633L9.57422 16.3281L10 16.7578L10.4258 16.3281L16.2188 10.4766C17.0391 9.68359 17.5 8.60547 17.5 7.44922C17.5 5.12891 15.6211 3.24219 13.3125 3.24219Z" fill="black"/>
                    </svg>
                    <span className="hover:text-accent cursor-pointer">MY FAVORITES</span>
                </div>
            </div>
        </div> 

        <div className="h-px w-full bg-primary/40" />

         <div className="w-full flex flex-row justify-between items-center">
            
            <img className="w-[270px] cursor-pointer" src='/assets/hotelLogo.png' onClick={homeClicked}/>
            
            <div className="flex flex-row">
                <div className="flex flex-row gap-3 items-center">
                    <span className="hover:text-accent cursor-pointer">BOOK HOTEL STAYS</span>
                    <div className="h-full w-[1.5px] bg-primary"/>
                    <span className="hover:text-accent cursor-pointer">BOOK PACKAGES</span>
                    <div className="h-full w-[1.5px] bg-primary"/>
                    <span className="hover:text-accent cursor-pointer">PREFERRED PARTNERS</span>
                    <div className="h-full w-[1.5px] bg-primary"/>
                    <span className="hover:text-accent cursor-pointer">HOW IT WORKS</span>
                    <div className="h-full w-[1.5px] bg-primary"/>
                    <span className="hover:text-accent cursor-pointer">CORPORATE</span>
                </div>
            </div>

            <Button className="bg-accent font-bold text-base">BUY GIFT VOUCHER</Button>

        </div>    
    
    </div>
}