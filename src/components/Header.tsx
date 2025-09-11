"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Header = () => {

  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<any>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<any>(false);

  const pathname = usePathname();


    useEffect(() => {
        if(auth){
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setLoggedIn(true)
            }
            else {
                setLoggedIn(false)
            }
          })
          return () => unsubscribe();
        }
      }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps
    
      

    
    const homeClicked = () => {
        // router.push(`/`)
        openLink("https://www.hotelandsparesorts.com")
    }

    const loginClicked = () => {
        router.push(`/login`)
    }

    const registerClicked = () => {
        router.push(`/login?register=true`)
    }

    const myAccountClicked = () => {
        router.push(`/user/my-bookings`)
    }

    const logoutClicked = () => {

        if(auth){
            signOut(auth).then(() => {
                // Sign-out successful.
                loginClicked()
            }).catch((error) => {
                // An error happened.
                console.log("ERROR: ", error.message);
            });
        }
    }

    const openLink = (url:string) => {
        console.log("URL CLICKED",url)
        window.open(url, "_blank");
    }


    return <div>
        <div className="hidden lg:block w-full flex flex-col items-start gap-5.5 px-5 md:px-[182px] py-[22px] text-base font-medium bg-light">

            <div className="w-full flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <span className="hover:text-accent cursor-pointer " onClick={()=>openLink("https://www.hotelandsparesorts.com/partner/login")}>PARTNER SIGN IN</span>
                    <div className="h-[15px] w-[1.5px] bg-primary"/>
                    <span className="hover:text-accent cursor-pointer ml-2" onClick={()=>openLink("https://www.hotelandsparesorts.com/become-partner")}>BECOME A PARTNER</span>
                </div>

                <div className="flex flex-row items-center gap-5">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.6094 12.1875C15.3906 10.9583 15.849 9.5 15.849 7.93229C15.849 3.55208 12.3021 0 7.92708 0C3.54687 0 0 3.55208 0 7.93229C0 12.3125 3.54688 15.8646 7.92188 15.8646C9.51042 15.8646 10.9896 15.3958 12.2292 14.5938L12.5885 14.3437L18.2448 20L20 18.2135L14.349 12.5573L14.6094 12.1875ZM12.3646 3.5C13.5469 4.68229 14.1979 6.25521 14.1979 7.92708C14.1979 9.59896 13.5469 11.1719 12.3646 12.3542C11.1823 13.5365 9.60937 14.1875 7.9375 14.1875C6.26562 14.1875 4.69271 13.5365 3.51042 12.3542C2.32812 11.1719 1.67708 9.59896 1.67708 7.92708C1.67708 6.25521 2.32812 4.68229 3.51042 3.5C4.69271 2.31771 6.26562 1.66667 7.9375 1.66667C9.60937 1.66667 11.1823 2.31771 12.3646 3.5Z" fill="#4D4D4D"/>
                    </svg> */}

                    <div className="flex flex-row gap-6 items-center">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M13.3125 3.84375C15.293 3.84375 16.9023 5.45703 16.9023 7.44922C16.9023 8.47266 16.4766 9.39453 15.7969 10.0508L10 15.9023L4.10156 9.94531C3.48438 9.29688 3.10156 8.41797 3.10156 7.44922C3.10156 5.45703 4.70703 3.84375 6.69141 3.84375C8.18359 3.84375 9.46094 4.75781 10.0039 6.0625C10.5391 4.76172 11.8203 3.84375 13.3125 3.84375ZM13.3125 3.24219C11.9922 3.24219 10.7812 3.85938 10 4.875C9.21875 3.85938 8.00781 3.24219 6.6875 3.24219C4.37891 3.24219 2.5 5.12891 2.5 7.44922C2.5 8.53906 2.91406 9.57422 3.66797 10.3633L9.57422 16.3281L10 16.7578L10.4258 16.3281L16.2188 10.4766C17.0391 9.68359 17.5 8.60547 17.5 7.44922C17.5 5.12891 15.6211 3.24219 13.3125 3.24219Z" fill="black"/>
                        </svg>
                        <span className="hover:text-accent cursor-pointer">MY FAVORITES</span> */}
                        {!loggedIn && <span className="text-primary/80 font-normal hover:text-accent cursor-pointer" onClick={loginClicked}>MEMBER LOGIN</span>}
                        {!loggedIn && <span className="text-primary/80 font-normal">|</span>}
                        {!loggedIn && <span className="text-primary/80 font-normal hover:text-accent cursor-pointer" onClick={registerClicked}>MEMBER SIGNUP</span>}
                        {loggedIn && <span className="text-primary/80 font-normal hover:text-accent cursor-pointer" onClick={myAccountClicked}>My Account</span>}
                        {loggedIn && <span className="text-primary/80 font-normal hover:text-accent cursor-pointer" onClick={logoutClicked}>Logout</span>}

                    </div>
                </div>
            </div> 

            <div className="h-px w-full bg-primary/40" />

            <div className={`w-full flex md:flex-row flex-col justify-between md:items-center items-start gap-2 mt-2 ${pathname==='/'?"mb-5":""}`}>
                
                <img className="w-[270px] cursor-pointer" src='/assets/hotelLogo.png' onClick={homeClicked}/>
                
                <div className="flex md:flex-row flex-col md:items-center items-start gap-9">

                    <div className="flex flex-row mb-1">
                        <div className="flex flex-row gap-5 items-center text-base">
                            <span className="hover:text-accent cursor-pointer" onClick={()=>openLink("/")}>BOOK A HOTEL STAY</span>
                            <div className="h-[17px] w-[1.2px] bg-primary"/>
                            <span className="hover:text-accent cursor-pointer" onClick={()=>openLink("https://www.hotelandsparesorts.com/packages")}>BOOK A PACKAGE</span>
                            {/* <div className="h-full w-[1.5px] bg-primary"/>
                            <span className="hover:text-accent cursor-pointer" onClick={()=>openLink("https://www.hotelandsparesorts.com/offers")}>PREFERRED PARTNERS</span> */}
                            <div className="h-[17px] w-[1.2px] bg-primary"/>
                            <span className="hover:text-accent cursor-pointer" onClick={()=>openLink("https://www.hotelandsparesorts.com/how-it-works")}>HOW IT WORKS</span>
                            <div className="h-[17px] w-[1.2px] bg-primary"/>
                            <span className="hover:text-accent cursor-pointer" onClick={()=>openLink("https://www.hotelandsparesorts.com/corporate-gift")}>CORPORATE GIFTING</span>
                        </div>
                    </div>

                    <Button className="bg-accent hover:bg-accent/90 font-bold text-[16.5px] px-6.5 py-7.75 rounded-xl" onClick={()=>openLink("https://hotelandsparesorts.com/shop-gift-voucher")}>BUY A GIFT VOUCHER</Button>
            
                </div>    

            </div>    

            {pathname!=='/' &&<div className="h-px w-full bg-primary/40" />}

        </div>

        <div className="relative lg:hidden w-full px-[10%] flex justify-between items-center ">
            
            <img className="w-[320px] cursor-pointer" src='/assets/hotelLogo.png' onClick={homeClicked}/>
            <div className="bg-[#774d46] h-[140px] w-[130px]" onClick={()=>setShowMobileMenu(!showMobileMenu)}>

            </div>

            <div className={`absolute top-[140px] right-0 w-full bg-[#774d46] z-100 flex justify-center overflow-hidden transition-all duration-700 ${
                    showMobileMenu ? "max-h-[1000px] opacity-100 pt-8 pb-8" : "max-h-0 opacity-0 pt-0 pb-0"
                }`}>
                <div className="flex flex-col items-center">

                    <Button className="bg-accent hover:bg-accent/90 font-bold text-2xl px-6.5 py-9 rounded-xl" onClick={()=>openLink("https://hotelandsparesorts.com/shop-gift-voucher")}>BUY A GIFT VOUCHER</Button>
                    
                    <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent" onClick={()=>openLink("/")}>BOOK A HOTEL STAY</span>
                    <div className="w-full h-px bg-accent"/>

                    <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent" onClick={()=>openLink("https://www.hotelandsparesorts.com/packages")}>BOOK A PACKAGE</span>
                    <div className="w-full h-px bg-accent"/>

                    <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent" onClick={()=>openLink("https://www.hotelandsparesorts.com/how-it-works")}>HOW IT WORKS</span>
                    <div className="w-full h-px bg-accent"/>

                    <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent" onClick={()=>openLink("https://www.hotelandsparesorts.com/corporate-gift")}>CORPORATE GIFTING</span>
                    <div className="w-full h-px bg-accent"/>

                    {/* <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent" onClick={()=>openLink("https://www.hotelandsparesorts.com/become-partner")}>BECOME A PARTNER</span>
                    <div className="w-full h-px bg-accent"/> */}

                    <span className="text-2xl font-bold text-light p-10 cursor-pointer hover:text-accent"onClick={loginClicked}>LOG IN</span>
                </div>

            </div>

        
        </div>
    </div>
}