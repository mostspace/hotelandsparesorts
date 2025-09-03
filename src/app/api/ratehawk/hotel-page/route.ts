import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

    const { hid,checkIn,checkOut,rooms} = await req.json();

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

      console.log("HOTEL PROFILE RES",data)


      let hotel = data.data.hotels[0]

      console.log("HOTEL",hotel)


      let rates:any[] = hotel?hotel.rates:[]

      let filteredRates:any[] = []

      rates.forEach(element => {
        
        // let roomName = element.room_data_trans.main_name
        // let existing = filteredRates.filter(item => item.room_data_trans.main_name === roomName);

        let roomName = element.room_name
        let existing = filteredRates.filter(item => item.room_name === roomName);

        let newPayType = element.payment_options.payment_types[0]
        let newPayAmount = newPayType.amount
        let newPayCancellation = newPayType.cancellation_penalties.free_cancellation_before
        

        if(existing.length === 0 ){

            if(newPayCancellation!==null && cancellationAtLeastWeekLong(newPayCancellation,checkIn)){
              filteredRates.push(element)
            }
        }
        else{

          if(newPayCancellation !== null){

            let replace = false

            let currentRate = existing[0]

            let currentPayType = currentRate.payment_options.payment_types[0]
            let currentAmount = currentPayType.amount
            let currentCancellation = currentPayType.cancellation_penalties.free_cancellation_before
            
            let weeksNotice = cancellationAtLeastWeekLong(newPayCancellation,checkIn)

            if(weeksNotice){

              if(newPayAmount<currentAmount)
              {
                replace = true
              }
              else if(newPayAmount===currentAmount && moreNotice(currentCancellation,newPayCancellation)){
                replace = true
              }

            }

            if(replace){
              let removed = filteredRates.filter(item => item.match_hash !== currentRate.match_hash);
              removed.push(element)
              filteredRates = removed
            }
          }

          
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

export const cancellationAtLeastWeekLong = (cancellationDate:string,checkInDate:string) => {

  let formattedCancellation = cancellationDate.split("T")[0]

  let d1 = new Date(formattedCancellation)
  let d2 = new Date(checkInDate)

  const diffMs = Math.abs(d2.getTime() - d1.getTime());

  // convert to days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 5;
}


const moreNotice = (cancellationDate:string,newCancellationDate:string) => {

  let formattedCancellation = cancellationDate.split("T")[0]
  let formattedNewCancellation = newCancellationDate.split("T")[0]

  let d1 = new Date(formattedCancellation)
  let d2 = new Date(formattedNewCancellation)

 
  return d2>d1;
}