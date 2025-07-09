"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function SearchScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const latNum = lat ? parseFloat(lat) : null;
  const lngNum = lng ? parseFloat(lng) : null;

  console.log("COORDS",latNum,lngNum)

    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState<any[]>([]);


  useEffect( () => {

    loadHotels()

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  
  const loadHotels = async () => {

    setLoading(true)
    const res = await fetch("/api/ratehawk/search/geo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat: latNum,lng:lngNum}),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotels:", data);

    setHotels(data)
    setLoading(false)
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
    router.push(`/hotel-profile?hid=${hid}`)
  }

    
  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>SEARCH PAGE</span>

      {loading && <span>Loading...</span>}


      <div className="flex flex-col items-start gap-10" >
        {!loading && showHotels()}
      </div>


    </div>
  );
}
