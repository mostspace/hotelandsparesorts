import { NextResponse } from 'next/server'


const testHash = 'h-995615c2-b3c3-530f-b2cb-5b29faf313ae'

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { hashID,hid } = await req.json();

    let bookHash = testHash
    if(+hid===8473727){
      console.log("TEST HOTEL")
      bookHash = hashID
    }

    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID}:${process.env.NEXT_RATEHAWK_API_KEY}`)
        },
        body: JSON.stringify({
          partner_order_id: Math.random().toString(36).slice(-8),
          book_hash: bookHash,
          language: "en",
          // user_ip: "82.29.0.86"
        })
      });
      
      const data = await response.json();
      console.log(data);

      resolve(NextResponse.json(data))

    })

}