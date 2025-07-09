import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise(async (resolve, reject) => {

    const { hid } = await req.json();


    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/hp/', {
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
          timeout:7,
          hid:hid,
          // id: "test_hotel_do_not_book",
          currency: "EUR"
        })
      });
      
      const data = await response.json();
      let hotel = data.data.hotels[0]

      const hotelWithDetails = await prisma.hotels.findUnique({
        where: {
          hid: hid,
        },
        include: {
          hotelDescriptions: true,
          images: true,
        },
      });

      if(hotelWithDetails){(hotelWithDetails as any).rates = hotel.rates}
      

      resolve(NextResponse.json(hotelWithDetails))

    })

}