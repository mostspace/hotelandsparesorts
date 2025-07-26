import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'
const API_KEY = '424E337DAFE14BE58C36ACA2ED22B998'
const locationID = '17813462'
export function GET() {

    return new Promise(async (resolve, reject) => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const hotelsWithoutTripadvisorId = await prisma.hotels.findMany({
        where: {
          tripadvisor_id: null,
          country_code:'GB',
        //   address: {
        //     contains: 'London',
        //   },
        },
        take: 50,
      });
      
    let array = []
    
    for(const hotel of hotelsWithoutTripadvisorId){


        const res = await fetch(`https://api.content.tripadvisor.com/api/v1/location/search?key=${API_KEY}&searchQuery=${hotel.hotel_name}&category=hotels&latLong=${hotel.lat}%2C%20${hotel.lng}&radius=0.01&radiusUnit=km&language=en`, options)
        const data:any = await res.json();
        
        let trip_id = 0
        let results:any[] = data.data
        results.forEach(element => {
            
            let id = +element.location_id
            let name = element.name
            let distance = +element.distance
            let postcode = element.postalcode


            if((distance<0.05 && trip_id==0) || (distance<1 && (name.toLowerCase()===(hotel.hotel_name||"").toLowerCase()))){ // || hotel.postcode === postcode) )){
                trip_id = id
            }
        });

        array.push({hotel:hotel.hotel_name,selectedID:trip_id,res:data})

        await prisma.hotels.update({
            where: { hid: hotel.hid},
            data: {
              tripadvisor_id: trip_id,
            },
          });

        await sleep(1000);
    }
      

    resolve(NextResponse.json(array))

    })

}



function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }