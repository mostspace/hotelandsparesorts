import { MapProvider } from "@/providers/map-provider"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import PlacesAutocomplete from "../maps/autocomplete"
import { useState } from "react"
import { useRouter } from "next/navigation";

interface SearchBarProps{
    showBorders:boolean
}

export const SearchBar = (props:SearchBarProps) => {

    const router = useRouter();
    const [coords, setCoords] = useState<any>(null);
    

    const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
        console.log('Selected place:', place);
        const location = place.geometry?.location;
        if (location) {
          let coords = {lat:location.lat(),lng:location.lng()}
          setCoords(coords)
        }
      };

    const searchClicked = () => {

        router.push(`/search?lat=${coords.lat}&lng=${coords.lng}`)
    } 

    return(
    <div className="w-full flex flex-row gap-4 text-primary justify-center ">

        <div className={`flex flex-row gap-3 bg-light px-[20px] py-[10px] w-[30%] items-center ${props.showBorders?"border border-primary":""}`}>
            
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M14.6094 12.6875C15.3906 11.4583 15.849 10 15.849 8.43229C15.849 4.05208 12.3021 0.5 7.92708 0.5C3.54687 0.5 0 4.05208 0 8.43229C0 12.8125 3.54688 16.3646 7.92188 16.3646C9.51042 16.3646 10.9896 15.8958 12.2292 15.0938L12.5885 14.8437L18.2448 20.5L20 18.7135L14.349 13.0573L14.6094 12.6875ZM12.3646 4C13.5469 5.18229 14.1979 6.75521 14.1979 8.42708C14.1979 10.099 13.5469 11.6719 12.3646 12.8542C11.1823 14.0365 9.60937 14.6875 7.9375 14.6875C6.26562 14.6875 4.69271 14.0365 3.51042 12.8542C2.32812 11.6719 1.67708 10.099 1.67708 8.42708C1.67708 6.75521 2.32812 5.18229 3.51042 4C4.69271 2.81771 6.26562 2.16667 7.9375 2.16667C9.60937 2.16667 11.1823 2.81771 12.3646 4Z" fill="#4D4D4D"/>
            </svg>

            <MapProvider>
                <PlacesAutocomplete onPlaceSelected={handlePlaceSelect} />
            </MapProvider>

        </div>



        <div className={`flex flex-row gap-3 bg-light px-[20px] py-[10px] w-[30%] ${props.showBorders?"border border-primary":""}`}>

            <div className="flex flex-col gap-1 w-full cursor-pointer">
                <span className="font-bold">Check-in</span>
                <span className={`font-normal`}>Add dates</span>
            </div>

            <div className="h-full w-px bg-primary/50"/>
        

            <div className="flex flex-col gap-1 w-full  cursor-pointer">
                <span className="font-bold">Check-Out</span>
                <span className={`font-normal`}>Add dates</span>
            </div>

        </div>

        <div className={`flex flex-col gap-1 items-start text-base  bg-light px-[20px] py-[10px] w-[20%] cursor-pointer ${props.showBorders?"border border-primary":""}`}>
            <span className="font-bold">Guests</span>
            <span className={`font-normal`}>1 Room, 2 Guests</span>
        </div>

        <Button className="h-[80px] w-[15%] bg-accent text-lg font-bold" onClick={searchClicked}>SEARCH</Button>


    </div>
    )

}