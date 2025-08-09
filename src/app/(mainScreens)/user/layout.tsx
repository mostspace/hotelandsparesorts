"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const options = ['my-details','my-bookings','vouchers','delete-account']
    const pathname = usePathname();
    const router = useRouter();

    const titleCase = (kebab:string) => {
        return kebab
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const getIcon = (option:string,isActive:boolean) => {


        switch(option){
            
            case 'my-details': 
                return(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 10.5C11.0111 10.5 10.0444 10.2068 9.22215 9.65735C8.39991 9.10794 7.75904 8.32705 7.3806 7.41342C7.00217 6.49979 6.90315 5.49446 7.09608 4.52455C7.289 3.55465 7.76521 2.66373 8.46447 1.96447C9.16373 1.26521 10.0546 0.789002 11.0246 0.596076C11.9945 0.40315 12.9998 0.502166 13.9134 0.880605C14.827 1.25904 15.6079 1.89991 16.1573 2.72215C16.7068 3.5444 17 4.5111 17 5.5C17 6.82608 16.4732 8.09785 15.5355 9.03553C14.5979 9.97322 13.3261 10.5 12 10.5ZM12 2.5C11.4067 2.5 10.8266 2.67595 10.3333 3.00559C9.83994 3.33524 9.45543 3.80377 9.22836 4.35195C9.0013 4.90013 8.94189 5.50333 9.05765 6.08527C9.1734 6.66722 9.45912 7.20176 9.87868 7.62132C10.2982 8.04088 10.8328 8.3266 11.4147 8.44236C11.9967 8.55811 12.5999 8.4987 13.1481 8.27164C13.6962 8.04458 14.1648 7.66006 14.4944 7.16671C14.8241 6.67337 15 6.09335 15 5.5C15 4.70435 14.6839 3.94129 14.1213 3.37868C13.5587 2.81607 12.7957 2.5 12 2.5Z" fill={isActive?"#A56658":"#333337"}/>
                    <path d="M21 23.5H3C2.73478 23.5 2.48043 23.3946 2.29289 23.2071C2.10536 23.0196 2 22.7652 2 22.5V19.5C2 17.3783 2.84285 15.3434 4.34315 13.8431C5.84344 12.3429 7.87827 11.5 10 11.5H14C16.1217 11.5 18.1566 12.3429 19.6569 13.8431C21.1571 15.3434 22 17.3783 22 19.5V22.5C22 22.7652 21.8946 23.0196 21.7071 23.2071C21.5196 23.3946 21.2652 23.5 21 23.5ZM4 21.5H20V19.5C20 17.9087 19.3679 16.3826 18.2426 15.2574C17.1174 14.1321 15.5913 13.5 14 13.5H10C8.4087 13.5 6.88258 14.1321 5.75736 15.2574C4.63214 16.3826 4 17.9087 4 19.5V21.5Z" fill={isActive?"#A56658":"#333337"}/>
                    </svg>)
            case 'my-bookings':
                return(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_105_570)">
                    <path d="M14.25 21.75H0.75V2.25H23.25V15" stroke={isActive?"#A56658":"#333337"} stroke-width="2" stroke-linejoin="round"/>
                    <path d="M0.75 6.75H23.25" stroke={isActive?"#A56658":"#333337"} stroke-width="2" stroke-linejoin="round"/>
                    <path d="M3 4.5H4.5" stroke={isActive?"#A56658":"#333337"} stroke-width="2" stroke-linejoin="round"/>
                    <path d="M6 4.5H7.5" stroke={isActive?"#A56658":"#333337"} stroke-width="2" stroke-linejoin="round"/>
                    <path d="M15.75 18.75L18 21L22.5 16.5" stroke={isActive?"#A56658":"#333337"} stroke-width="2" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_105_570">
                    <rect width="24" height="24" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>)
            case 'vouchers':
                return(<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.94517 11.1889H2.63672V22.4121H19.9499V13.916M4.94517 11.1889H19.9499V13.916M4.94517 11.1889V7.83237M19.9499 13.916H22.3633V7.83237M4.94517 7.83237H22.3633M4.94517 7.83237V5.21016M22.3633 7.83237V5.21016M4.94517 5.21016V2.58789H22.3633V5.21016M4.94517 5.21016H22.3633M4.94517 13.916H8.82749M4.52543 19.9997H5.8895M7.3585 19.9997H8.61763M10.0866 19.9997H11.5557M17.7464 14.9649C17.7464 15.7759 17.0887 16.4334 16.2774 16.4334C15.4661 16.4334 14.8084 15.7759 14.8084 14.9649C14.8084 14.1539 15.4661 13.4964 16.2774 13.4964C17.0887 13.4964 17.7464 14.1539 17.7464 14.9649Z" stroke={isActive?"#A56658":"#333337"} stroke-width="1.5"/>
                    </svg>
                    )
            case 'delete-account':
                return(<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 1.5H14C14 1.23478 13.8946 0.98043 13.7071 0.792893C13.5196 0.605357 13.2652 0.5 13 0.5H11C10.7348 0.5 10.4804 0.605357 10.2929 0.792893C10.1054 0.98043 10 1.23478 10 1.5H3C2.73478 1.5 2.48043 1.60536 2.29289 1.79289C2.10536 1.98043 2 2.23478 2 2.5C2 2.76522 2.10536 3.01957 2.29289 3.20711C2.48043 3.39464 2.73478 3.5 3 3.5H21C21.2652 3.5 21.5196 3.39464 21.7071 3.20711C21.8946 3.01957 22 2.76522 22 2.5C22 2.23478 21.8946 1.98043 21.7071 1.79289C21.5196 1.60536 21.2652 1.5 21 1.5Z" fill={isActive?"#A56658":"#333337"}/>
                    <path d="M19.5 4.5C19.2348 4.5 18.9804 4.60536 18.7929 4.79289C18.6054 4.98043 18.5 5.23478 18.5 5.5V21.5H5.5V5.5C5.5 5.23478 5.39464 4.98043 5.20711 4.79289C5.01957 4.60536 4.76522 4.5 4.5 4.5C4.23478 4.5 3.98043 4.60536 3.79289 4.79289C3.60536 4.98043 3.5 5.23478 3.5 5.5V22.5C3.5 22.7652 3.60536 23.0196 3.79289 23.2071C3.98043 23.3946 4.23478 23.5 4.5 23.5H19.5C19.7652 23.5 20.0196 23.3946 20.2071 23.2071C20.3946 23.0196 20.5 22.7652 20.5 22.5V5.5C20.5 5.23478 20.3946 4.98043 20.2071 4.79289C20.0196 4.60536 19.7652 4.5 19.5 4.5Z" fill={isActive?"#A56658":"#333337"}/>
                    <path d="M10.5 18.5V9.5C10.5 9.23478 10.3946 8.98043 10.2071 8.79289C10.0196 8.60536 9.76522 8.5 9.5 8.5C9.23478 8.5 8.98043 8.60536 8.79289 8.79289C8.60536 8.98043 8.5 9.23478 8.5 9.5V18.5C8.5 18.7652 8.60536 19.0196 8.79289 19.2071C8.98043 19.3946 9.23478 19.5 9.5 19.5C9.76522 19.5 10.0196 19.3946 10.2071 19.2071C10.3946 19.0196 10.5 18.7652 10.5 18.5Z" fill={isActive?"#A56658":"#333337"}/>
                    <path d="M15.5 18.5V9.5C15.5 9.23478 15.3946 8.98043 15.2071 8.79289C15.0196 8.60536 14.7652 8.5 14.5 8.5C14.2348 8.5 13.9804 8.60536 13.7929 8.79289C13.6054 8.98043 13.5 9.23478 13.5 9.5V18.5C13.5 18.7652 13.6054 19.0196 13.7929 19.2071C13.9804 19.3946 14.2348 19.5 14.5 19.5C14.7652 19.5 15.0196 19.3946 15.2071 19.2071C15.3946 19.0196 15.5 18.7652 15.5 18.5Z" fill={isActive?"#A56658":"#333337"}/>
                    </svg>
                    )
        }
    }


    const showSideBarOptions = () => {

        const compArray:any = []

        options.forEach(option => {

            const isActive = pathname.includes(option); 
            
            compArray.push(<div className='w-full flex flex-row gap-8 items-start'>
                <div className='w-full flex flex-col gap-5 items-start'>
                    <div className='flex flex-row justify-start items-center gap-8.5 cursor-pointer' onClick={()=>changePage(option)}>
                        {getIcon(option,isActive)}
                        <span className={`text-xl ${isActive?"font-bold text-accent":""}`}>{titleCase(option)}</span>
                    </div>
                    <div className='w-full h-px bg-primary/50'/>
                </div>
                <div className={`w-[8px] h-[30px] ${isActive?"bg-accent":"bg-transparent"} `}/>
            </div>)


        });

        return compArray
    }


    const changePage = (path:string) => {
        router.push(`/user/${path}`)
    }




  return (
    <div className="flex flex-row w-full">
      
      <div className='w-[330px] h-full bg-white flex flex-col justify-between  pl-[20px] py-[16px]' style={{ minHeight: "calc(100vh - 200px)" }}>

        <div className='flex flex-col w-full gap-7.5 items-start'>
            {showSideBarOptions()}
        </div>
        <span>Logout</span>
      </div>
      
      <main className="flex-1 p-6 bg-muted px-[100px] py-[68px]">
        {children}
      </main>
    </div>
  );
}
