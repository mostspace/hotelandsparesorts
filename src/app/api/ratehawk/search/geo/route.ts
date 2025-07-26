import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise(async (resolve, reject) => {

      const { lat,lng,radius } = await req.json();


    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/serp/geo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
        },
        body: JSON.stringify({
          checkin: "2025-10-22",
          checkout: "2025-10-25",
          residency: "gb",
          language: "en",
          guests: [
            {
              adults: 2,
              children: []
            }
          ],
          // IRELAND
          // longitude: -6.256012415626754,
          // latitude: 53.33891941773272, 
          longitude: lng,
          latitude: lat, 
          radius: radius,
          currency: "EUR"
        })
      });
      
      const data = await response.json();
      console.log(data);

      let hotels = data.data.hotels
      let hotelIds = hotels.map((item: { hid: any; }) => item.hid);


      const hotelsDB = await prisma.hotels.findMany({
        where: {
            hid: {
            in: hotelIds,
            },
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







