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
    <div className="relative flex flex-col justify-center items-start gap-15 px-5  md:p-[140px] bg-[url('/assets/homeImg.jpg')] bg-cover h-200" >
      
      <div className="absolute top-0 left-0 w-full h-full bg-alt/30"/>

      <div className="flex flex-col items-start text-light font-normal z-10">
          <span className="text-[80px]" style={{fontFamily:'Harlow'}}>BOOK A HOTEL STAY</span>
          <span className="text-3xl" style={{fontFamily:'Harlow'}}>Explore and book our curated luxury hotels and redeem your voucher</span>
      </div>

      <SearchBar showLocation={true} showBorders={false} existingData={{}}/>    

    </div>
  );
}
