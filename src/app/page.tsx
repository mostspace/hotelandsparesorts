"use client";

import PlacesAutocomplete from "@/components/maps/autocomplete";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { MapProvider } from "@/providers/map-provider";
import { useState } from "react";

export default function HomeScreen() {

  const [coords, setCoords] = useState<any>(null);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log('Selected place:', place);
    const location = place.geometry?.location;
    if (location) {
      let coords = {lat:location.lat(),lng:location.lng()}
      setCoords(coords)
    }
  };

  return (
    <div className="w-full relative bg-[url('/assets/homeImg.jpg')] bg-cover bg-center md:h-200 h-250 flex justify-center">
      <div className="w-full flex flex-col justify-center items-start gap-15 lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%] px-5 breakingPoint" >
        <div className="absolute top-0 left-0 w-full h-full bg-alt/40"/>
        <div className="flex flex-col items-start text-light font-normal z-10">
          {/* <span className="text-[80px]" style={{fontFamily:'Harlow'}}>BOOK A HOTEL STAY</span>  */}
          {/* <span className="text-3xl" style={{fontFamily:'Harlow'}}>Explore and book our curated luxury hotels and redeem your voucher</span> */}
          <span className="md:text-[80px] sm:text-[70px] text-[60px]" style={{fontFamily:'Harlow Duo Serif', lineHeight:'110%'}}>BOOK A HOTEL STAY</span> 
          {/* <span className="text-3xl" style={{fontFamily:'Harlow'}}>Exciting news - the world’s most flexible luxury hotel gift voucher will soon unlock <strong>10,000 luxury hotels in 75 countries worldwide.</strong></span>
          <span className="text-3xl" style={{fontFamily:'Harlow'}}>Global redemption arriving 24th September!</span> */}
          <span className="text-3xl" style={{fontFamily:'Harlow Duo Serif'}}>Explore and book our curated collection of luxury hotels and redeem your gift voucher.</span>
        </div>
        <SearchBar showLocation={true} showBorders={false} existingData={{}}/>    
      </div>
    </div>
  );
}