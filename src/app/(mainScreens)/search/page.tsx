"use client";

import { MapComponent } from "@/components/maps/googleMaps";
import { Button } from "@/components/ui/button";
import { MapProvider } from "@/providers/map-provider";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function SearchScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const latP = searchParams.get('lat');
  const lngP = searchParams.get('lng');

  const latNum = latP ? parseFloat(latP) : null;
  const lngNum = lngP ? parseFloat(lngP) : null;

  console.log("COORDS",latNum,lngNum)

    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState<any[]>([]);
    const [mapOpen, setMapOpen] = useState(false);
    const [updateVar, setUpdateVar] = useState(0);

    const [lat, setLat] = useState(latNum);
    const [lng, setLng] = useState(lngNum);


  useEffect( () => {

    loadHotels(latNum||0,lngNum||0,3000)

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  
  const loadHotels = async (latNum:number,lngNum:number,radiusM:number) => {

    setLoading(true)
    const res = await fetch("/api/ratehawk/search/geo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat: latNum,lng:lngNum,radius:radiusM}),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotels:", data);

    setHotels(data)
    setLoading(false)
    setUpdateVar(updateVar+1)
  }

  const showHotels = () => {

    let compArray:any[] = []

    hotels.forEach(hotel => {

      let ratesArray:any[] = []
      let rates:any[] = hotel.rates

      let i = 0

      rates.forEach(rate => {
        if(i<3){
          let price = rate.payment_options.payment_types[0].amount
          let roomName = rate.room_data_trans?rate.room_data_trans.main_name:rate.room_name

          ratesArray.push(<div className="flex flex-row items-start justify-start gap-2">

            <span className="text-xs">{roomName}</span>
            <span className="text-sm">€{price}</span>

          </div>)
        }
        i++;
      });

      
      compArray.push(<div className="flex flex-row items-start justify-start gap-1">
        <div className="flex flex-col items-start gap-1 w-xs">
          <span className="text-lg max-w-xs	">{hotel.hotel_name}</span>
          <span className="text-sm">{hotel.address}</span>
          <span className="text-sm">{hotel.email}</span>

        </div>
        <div className="flex flex-col items-start gap-1 w-xs">
          {ratesArray}
        </div>
        <Button onClick={()=>openHotel(hotel.hid)}>View Hotel</Button>
      </div>)
    });

    return compArray

  }

  const openHotel = (hid:number) => {
    router.push(`/hotel-profile?hid=${hid}&checkIn=${'2025-10-22'}&checkOut=${'2025-10-25'}`)
  }

  const mapMovedNewSearch = (data:any) => {
    let lat = data.centre.lat
    let lng = data.centre.lng

    let radiusKm = data.radiusKm

    let radius = Math.floor(radiusKm*1000)

    setLat(lat)
    setLng(lng)
    loadHotels(lat,lng,radius)

  }
    
  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>SEARCH PAGE</span>

      {loading && <span>Loading...</span>}

      {!loading && <Button onClick={()=>setMapOpen(!mapOpen)}>Show {mapOpen?"List":"Map"}</Button>}

      {!mapOpen && <div className="flex flex-col items-start gap-10" >
        {!loading && showHotels()}
      </div>}

      {mapOpen && <div className="flex flex-row items-center  gap-2 w-250 h-250"  >
        <MapProvider>
          <MapComponent hotels={hotels} lat={lat||0} lng={lng||0} newSearch={mapMovedNewSearch} updateVar={updateVar}/>
        </MapProvider>
      </div>}


    </div>
  );
}
