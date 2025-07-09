"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HotelProfileScreen() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const hidStr = searchParams.get('hid');
  const hid = hidStr ? parseInt(hidStr) : null;

  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<any>(null);


  useEffect( () => {
  
      loadHotel()
  
    }, []);

  const loadHotel = async () => {
    setLoading(true)
    const res = await fetch("/api/ratehawk/hotel-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hid:hid}),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    console.log("Hotel:", data);

    setHotel(data)
    setLoading(false)
  }


  const showDescriptions = (descArray:any[]) => {

    let compArray:any[] = []

    let structuredArray = []
    let currentTitle = "STARTVALUE"
    var currentParagraphs:any[] = []
    descArray.forEach(element => {
      if(currentTitle!=element.title){
        if(currentTitle!="STARTVALUE"){
          structuredArray.push({
            title:currentTitle,
            paragraphs:currentParagraphs
          })
        }
        currentTitle = element.title
        currentParagraphs = []
      }
      currentParagraphs.push(element.paragraph)
    });

    structuredArray.push({
      title:currentTitle,
      paragraphs:currentParagraphs
    })

    

    structuredArray.forEach(element => {

      let paragraphArray:any[] = []
      element.paragraphs.forEach(paragraph => {
        paragraphArray.push(<span className="max-w-xl">{paragraph}</span>)
      });

      compArray.push(<div className="flex flex-col gap-2">
        <span className="text-lg">{element.title}</span>
        <div className="flex flex-col gap-2 text-sm">
          {paragraphArray}
        </div>
      </div>)
    });


    
    return compArray

  }

  const showImages = () => {

    let imageArray:any[] = []

    let i = 0
    hotel.images.forEach((image: { url: any; }) => {
    if(i<6 && i>2)
    {
      let imageUrl = image.url
      let newURL = imageUrl.replace('{size}','240x240')

      imageArray.push(<img src={newURL}/>)
    }
    i++;

    });
    
    return imageArray
  }

  const showRates = () => {
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

    return ratesArray
  }


    
  return (
    <div className="flex flex-col items-center gap-1" >
      
      <span>HOTEL PROFILE PAGE</span>

      {loading && <span>Loading...</span>}

      {hotel && <div className="flex flex-col items-start gap-10">
        
        {/* Images */}
        <div className="flex flex-row item-centre">
          {showImages()}
        </div>

        {/* Basic Info */}
        <div className="flex flex-col justify-start">
          <span className="text-2xl max-w-xs	">{hotel.hotel_name}</span>
          <span className="text-sm">{hotel.address}</span>
          <span className="text-sm">{hotel.email}</span>
        </div>

        {/* Descriptions */}
        <div className="flex flex-col justify-start gap-3">
          <span className="text-xl">Description</span>
          {showDescriptions(hotel.hotelDescriptions.filter(descr => descr.kind === "description"))}
        </div>


        {/* Rates */}
        <div className="flex flex-col justify-start">
        <span className="text-xl">Rates</span>
          {showRates()}
        </div>



         {/* Policies */}
         <div className="flex flex-col justify-start gap-3">
          <span className="text-xl">Policies</span>
          {showDescriptions(hotel.hotelDescriptions.filter(descr => descr.kind === "policy"))}

        </div>

        
      </div>}

    </div>
  );
}
