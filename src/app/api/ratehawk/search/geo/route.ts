import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise(async (resolve, reject) => {

      const { lat,lng,radius,filters } = await req.json();


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
      console.log("DATA",data);

      var hotels = data.data.hotels
      var filteredHotels:any[] = hotels

      const whereClause: any = {
      };

      filters.forEach((filter:any) => {
        
        if(filter.id === "A" && filter.selected.length>0){
          
          let hotelArray:any[] = []
          filteredHotels.forEach((hotel:any) => {
            let rates = hotel.rates
            let dailyPrice = rates.length>0?+rates[0].daily_prices[0]:-1
            if(dailyPrice>filter.selected[0] && dailyPrice<filter.selected[1]){

              console.log("CAUGHT",dailyPrice,filter.selected[0],filter.selected[1])
              hotelArray.push(hotel)
            }
          });
          filteredHotels = hotelArray
        }

        if(filter.id === "B" && filter.selected.length>0){
          whereClause.kind = {
            in:filter.selected
          }
        }
        if(filter.id === "C" && filter.selected.length>0){
          
          let stars = filter.selected.map((item:any) => {
            return +(item.replace(" Stars","")); // for example
          });
          whereClause.star_rating = {
            in:stars
          }

        }
        if(filter.id === "D" && filter.selected.length>0){
          
        }
        if(filter.id === "E" && filter.selected.length>0){
          
        }
        if(filter.id === "N"){
          whereClause.hotel_name = {
            contains: filter.value,
          }
        }

      });
      
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







