import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'


export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

      const {hid,checkIn,checkOut,rooms } = await req.json();

      let roomArray:any[] = []
      rooms.forEach((room: { adults:number, children: number, childrenAges:any[]; }) => {
        
          // let childrenArray = []
          // for(var i=0;i<room.children;i++){
          //   childrenArray.push(9)
          // }

          roomArray.push({
            adults:room.adults,
            children:room.childrenAges
          })
          
      });
     

      console.log("ROOM ARRAY", roomArray)


    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/serp/hotels/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID}:${process.env.NEXT_RATEHAWK_API_KEY}`)
        },
        body: JSON.stringify({
          checkin: checkIn,
          checkout: checkOut,
          residency: "ie",
          language: "en",
          guests: roomArray,
          hids:[hid],
          currency: "EUR",
        })
      });
      
      const data = await response.json();
      console.log("DATA FOR HID SEARCH",data);

      var hotels = data.data.hotels
      var filteredHotels:any[] = hotels

      const whereClause: any = {
      };

  
      
      let hotelIds = filteredHotels.map((item: { hid: any; }) => item.hid);
      
     

      whereClause.hid = {
          in: hotelIds,
      }
   

      const hotelsDB = await prisma.hotels.findMany({
        where: whereClause,
        include: {
          images: true,
        },
      });

      const mergedArray = hotelsDB.map((hotel: { hid: any; }) => {
        const match = hotels.find((rateObj: { hid: any; }) => rateObj.hid === hotel.hid);
        return {
          ...hotel,
          rates: match ? match.rates : null
        };
      });



    resolve(NextResponse.json(mergedArray))

    })

}







