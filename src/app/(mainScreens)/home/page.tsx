"use client";

import PlacesAutocomplete from "@/components/maps/autocomplete";
import { Button } from "@/components/ui/button";
import { MapProvider } from "@/providers/map-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeScreen() {

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

  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>HOME PAGE</span>

      <MapProvider>
      <div className="max-w-md mx-auto mt-10">
        <PlacesAutocomplete onPlaceSelected={handlePlaceSelect} />
      </div>
    </MapProvider>

    <Button disabled={coords === null} onClick={searchClicked}>Search</Button>

    </div>
  );
}
