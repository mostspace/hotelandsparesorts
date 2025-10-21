import { NextResponse } from 'next/server'


export async function POST(req:Request) {

  return new Promise<any>(async (resolve, reject) => {

    const { partnerID } = await req.json();

    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID_PREMIUM}:${process.env.NEXT_RATEHAWK_API_KEY_PREMIUM}`)
        },
        body: JSON.stringify({
          partner_order_id:partnerID
        })
      });
      

      console.log("RESPINSE",response)

      const data = await response.json();
      console.log(data);
      resolve(NextResponse.json(data))

   })
}