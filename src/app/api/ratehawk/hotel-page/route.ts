import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

    const { hid,checkIn,checkOut,rooms} = await req.json();

    let roomArray:any[] = []
      rooms.forEach((room: { adults:number, children: number; }) => {
        
          let childrenArray = []
          for(var i=0;i<room.children;i++){
            childrenArray.push(9)
          }

          roomArray.push({
            adults:room.adults,
            children:childrenArray
          })
          
      });

    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/hp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
        },
        body: JSON.stringify({
          checkin: checkIn,
          checkout: checkOut,
          residency: "gb",
          language: "en",
          guests: roomArray,
          timeout:7,
          hid:hid,
          currency: "EUR"
        })
      });
      
      const data = await response.json();


      let hotel = data.data.hotels[0]

      console.log("HOTEL",hotel)


      let rates:any[] = hotel.rates

      let filteredRates:any[] = []

      rates.forEach(element => {
        
        // let roomName = element.room_data_trans.main_name
        // let existing = filteredRates.filter(item => item.room_data_trans.main_name === roomName);
        let roomName = element.room_name
        let existing = filteredRates.filter(item => item.room_name === roomName);
        if(existing.length === 0){
          console.log("NEW ROOM",roomName)
          filteredRates.push(element)
        }
      });

      const hotelWithDetails = await prisma.hotels.findUnique({
        where: {
          hid: hid,
        },
        include: {
          hotelDescriptions: true,
          images: true,
        },
      });

      if(hotelWithDetails){(hotelWithDetails as any).rates = filteredRates}
      if(hotelWithDetails){(hotelWithDetails as any).amenities = (hotelWithDetails as any).amenities.split(",")}

      resolve(NextResponse.json(hotelWithDetails))

    })

}