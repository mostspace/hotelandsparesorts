import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'


export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

      const { lat,lng,checkIn,checkOut,rooms,radius,filters,exludedHid,type } = await req.json();

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
     

      console.log("ENV VARIABLES", type==="premium"?process.env.NEXT_RATEHAWK_KEY_ID_PREMIUM:process.env.NEXT_RATEHAWK_KEY_ID,type==="premium"?process.env.NEXT_RATEHAWK_API_KEY_PREMIUM:process.env.NEXT_RATEHAWK_API_KEY)


    const response = await fetch('https://api.worldota.net/api/b2b/v3/search/serp/geo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${type==="premium"?process.env.NEXT_RATEHAWK_KEY_ID_PREMIUM:process.env.NEXT_RATEHAWK_KEY_ID}:${type==="premium"?process.env.NEXT_RATEHAWK_API_KEY_PREMIUM:process.env.NEXT_RATEHAWK_API_KEY}`)
        },
        body: JSON.stringify({
          checkin: checkIn,
          checkout: checkOut,
          residency: "ie",
          language: "en",
          guests: roomArray,
          // IRELAND
          // longitude: -6.256012415626754,
          // latitude: 53.33891941773272, 
          longitude: lng,
          latitude: lat, 
          radius: radius,
          currency: "EUR",
          limit: exludedHid?5:500
        })
      });
      
      const data = await response.json();
      console.log("DATA",data);

      if(!data.data){    resolve(NextResponse.json([]))}

      var hotels = data.data.hotels
      var filteredHotels:any[] = hotels

      var addedKindFilter = false

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
          addedKindFilter = true
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
      
      console.log("HOTEL IDS",hotelIds)

      if(exludedHid){
        hotelIds = hotelIds.filter(item => item !== exludedHid);
      }

      whereClause.hid = {
          in: hotelIds,
      }

      if(!addedKindFilter){
        whereClause.kind = {
          in: ['Hotel','Castle','Farm','Resort','Boutique & Design']
        }
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

      let hotelsWithCancellation:any[] = []
      mergedArray.forEach((hotel:any) => {
          let rates:any[] = hotel.rates
          let acceptableRates:any[] = []

          rates.forEach(rate => {
            let cancellation = rate.payment_options.payment_types[0].cancellation_penalties.free_cancellation_before
            if(cancellation !== null && cancellationAtLeastWeekLong(cancellation,checkIn)){
              acceptableRates.push(rate)
            }
          });

          if(acceptableRates.length>0){
            hotel.rates = acceptableRates
            hotel.distance = getDistanceFromLatLon(hotel.lat,hotel.lng,lat,lng)
            hotelsWithCancellation.push(hotel)
          }

      });







    resolve(NextResponse.json(hotelsWithCancellation))

    })

}

const cancellationAtLeastWeekLong = (cancellationDate:string,checkInDate:string) => {

  let formattedCancellation = cancellationDate.split("T")[0]

  let d1 = new Date(formattedCancellation)
  let d2 = new Date(checkInDate)

  const diffMs = Math.abs(d2.getTime() - d1.getTime());

  // convert to days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 1;
}

// Returns distance in kilometers by default
function getDistanceFromLatLon(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: "km" | "mi" = "km"
): number {
  const R = unit === "km" ? 6371 : 3959; // Radius of the Earth (km or miles)
  const toRad = (deg: number) => deg * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in chosen unit
}








