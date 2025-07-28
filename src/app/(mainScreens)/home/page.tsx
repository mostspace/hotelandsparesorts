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
    <div className="flex flex-col justify-center items-start gap-15 p-[140px] bg-[url('/assets/manorHouse.jpg')] bg-cover h-200" >
      
      <div className="flex flex-col items-start text-light font-normal">
          <span className="text-[80px]">BOOK A HOTEL STAY</span>
          <span className="text-3xl">Explore and book our curated luxury hotels and redeem your voucher</span>
      </div>

      <SearchBar />    

    </div>
  );
}
