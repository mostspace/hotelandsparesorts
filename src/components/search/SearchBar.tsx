import { MapProvider } from "@/providers/map-provider"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import PlacesAutocomplete from "../maps/autocomplete"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"

interface SearchBarProps{
    showBorders:boolean
    showLocation:boolean
    existingData:any
}

export const SearchBar = (props:SearchBarProps) => {

    const rootRef = useRef<HTMLDivElement>(null)

    const router = useRouter();
    const [coords, setCoords] = useState<any>(props.existingData.coords || null);
    const [locationName, setLocationName] = useState<any>(props.existingData.locationName||"");
    
    const [checkInDate, setCheckInDate] = useState<Date | undefined>(props.existingData.checkInDate||undefined)
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(props.existingData.checkOutDate||undefined)

    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [showGuestPicker, setShowGuestPicker] = useState(false);

    const [adults, setAdults] = useState(props.existingData.adults || 1);
    const [children, setChildren] = useState(props.existingData.children || 0);


    const today = new Date()

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        // Click is outside SearchBar
        setShowCheckInPicker(false);
        setShowCheckOutPicker(false);
        setShowGuestPicker(false);
        }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
      

    const openPicker = (type:string) => {

        setShowCheckInPicker(false)
        setShowCheckOutPicker(false)
        setShowGuestPicker(false)

        if(type==="checkin"){setShowCheckInPicker(true)}
        else if(type==="checkout"){setShowCheckOutPicker(true)}
        else if(type==="guests"){setShowGuestPicker(true)}

    }

    useEffect(() => {
        setShowCheckInPicker(false)
    }, [checkInDate]);

    useEffect(() => {
        setShowCheckOutPicker(false)
    }, [checkOutDate]);


    const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
        console.log('Selected place:', place);
        const location = place.geometry?.location;
        if (location) {
            
          setLocationName(place.name)
          let coords = {lat:location.lat(),lng:location.lng()}
          setCoords(coords)
        }
      };

    

    const searchClicked = () => {

        let searchID = Math.random().toString(16).slice(-8)

        if(props.existingData.hid){
            let hid = props.existingData.hid
            router.push(`/hotel-profile?hid=${hid}&checkIn=${format(checkInDate||new Date(), 'yyyy-MM-dd')}&checkOut=${format(checkOutDate||new Date(), 'yyyy-MM-dd')}`)
        }else{
            router.push(`/search?searchID=${searchID}&location=${locationName}&lat=${coords.lat}&lng=${coords.lng}&check-in=${format(checkInDate||new Date(), 'yyyy-MM-dd')}&check-out=${format(checkOutDate||new Date(), 'yyyy-MM-dd')}&adults=${adults}&children=${children}`)
        }


    } 

    const removeAdult = () => {
        setAdults(adults-1>0?adults-1:0)
    }

    const addAdult = () => {
        setAdults(adults+1)
    }

    const removeChild = () => {
        setChildren(children-1>0?children-1:0)
    }

    const addChild = () => {
        setChildren(children+1)
    }



    return(
    <div ref={rootRef} className="w-full flex flex-row gap-4 text-primary justify-center z-10">

        {props.showLocation && <div className={`flex flex-row gap-3 bg-light px-[20px] py-[10px] w-[30%] items-center ${props.showBorders?"border border-primary":""}`} onClick={()=>openPicker("")}>
            
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M14.6094 12.6875C15.3906 11.4583 15.849 10 15.849 8.43229C15.849 4.05208 12.3021 0.5 7.92708 0.5C3.54687 0.5 0 4.05208 0 8.43229C0 12.8125 3.54688 16.3646 7.92188 16.3646C9.51042 16.3646 10.9896 15.8958 12.2292 15.0938L12.5885 14.8437L18.2448 20.5L20 18.7135L14.349 13.0573L14.6094 12.6875ZM12.3646 4C13.5469 5.18229 14.1979 6.75521 14.1979 8.42708C14.1979 10.099 13.5469 11.6719 12.3646 12.8542C11.1823 14.0365 9.60937 14.6875 7.9375 14.6875C6.26562 14.6875 4.69271 14.0365 3.51042 12.8542C2.32812 11.6719 1.67708 10.099 1.67708 8.42708C1.67708 6.75521 2.32812 5.18229 3.51042 4C4.69271 2.81771 6.26562 2.16667 7.9375 2.16667C9.60937 2.16667 11.1823 2.81771 12.3646 4Z" fill="#4D4D4D"/>
            </svg>

            <MapProvider>
                <PlacesAutocomplete onPlaceSelected={handlePlaceSelect} locationName={locationName}/>
            </MapProvider>

        </div>}


        {!props.showLocation && <div className={`relative flex flex-col gap-1 items-start text-base  bg-light px-[20px] py-[10px] w-[30%] cursor-pointer ${props.showBorders?"border border-primary":""}`}  onClick={()=>openPicker("checkin")}>
            <span className="font-bold">Check-in</span>
            <span className={`font-normal`}>{checkInDate===undefined?"Add date":format(checkInDate, "PPP")}</span>
            {showCheckInPicker && <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    defaultMonth={checkInDate ?? new Date()}
                    disabled={(date) => {
                        const today = new Date();
                        if (checkOutDate) {
                          return date < today || date > checkOutDate;
                        }
                        return date < today;
                      }}
                    className="absolute w-full left-0 top-21 rounded-md border border-primary bg-white z-10"
                />}
        </div>}

        <div className={`relative flex flex-row gap-3 bg-light px-[20px] py-[10px] w-[30%] ${props.showBorders?"border border-primary":""}`}>

            {props.showLocation && <div className=" flex flex-col gap-1 w-full  cursor-pointer" onClick={()=>openPicker('checkin')}>
                <span className="font-bold">Check-In</span>
                <span className={`font-normal`}>{checkInDate===undefined?"Add date":format(checkInDate, "PPP")}</span>
                
                {showCheckInPicker && <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    defaultMonth={checkInDate ?? new Date()}
                    disabled={(date) => {
                        const today = new Date();
                        if (checkOutDate) {
                          return date < today || date > checkOutDate;
                        }
                        return date < today;
                      }}
                    className="absolute w-full left-0 top-21 rounded-md border border-primary bg-white z-10"
                />}
              
            </div>}

            {props.showLocation && <div className="h-full w-px bg-primary/50"/>}
        

            <div className="flex flex-col gap-1 w-full  cursor-pointer" onClick={()=>openPicker("checkout")}>
                <span className="font-bold">Check-Out</span>
                <span className={`font-normal`}>{checkOutDate===undefined?"Add date":format(checkOutDate, "PPP")}</span>

                {showCheckOutPicker && <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    defaultMonth={checkOutDate ?? checkInDate ?? new Date()}
                    disabled={(date) => date < (checkInDate || new Date())} // disables past dates
                    className="absolute w-full left-0 top-21 rounded-md border border-primary bg-white z-10"
                />}
            </div>

        </div>

        <div className={`relative flex flex-col gap-1 items-start text-base  bg-light px-[20px] py-[10px] w-[20%] cursor-pointer ${props.showBorders?"border border-primary":""}`} onClick={()=>openPicker('guests')}>
            <span className="font-bold">Guests</span>
            <span className={`font-normal`}>{`1 Room, ${adults+children} Guests`}</span>

           {showGuestPicker && <div className="absolute w-full left-0 top-21 rounded-md border border-primary bg-white flex flex-col gap-3 p-5 z-10">
                
                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-medium">Adults</span>
                        <span>18+</span>
                    </div>
                    <div className=" flex flex-row justify-end items-center gap-3 font-medium text-2xl">
                        <div className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light" onClick={removeAdult}>
                            -
                        </div>
                        <span  className="w-[20px] text-center">{adults}</span>
                        <div className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light"  onClick={addAdult}>
                            +
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-primary/50"/>

                <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col items-start">
                        <span className="text-lg font-medium">Children</span>
                        <span>1-17</span>
                    </div>
                    <div className=" flex flex-row justify-end items-center gap-3 font-medium text-2xl">
                        <div className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light"  onClick={removeChild}>
                            -
                        </div>
                        <span className="w-[20px] text-center">{children}</span>
                        <div className="h-[30px] w-[30px] bg-accent flex rounded-full justify-center items-center text-light"  onClick={addChild}>
                            +
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-primary/50"/>

            </div>}
        </div>

        <Button className="h-[80px] w-[15%] bg-accent text-lg font-bold" onClick={searchClicked}>SEARCH</Button>


    </div>
    )

}