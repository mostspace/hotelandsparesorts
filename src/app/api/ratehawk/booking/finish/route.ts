import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

const bookHash = 'h-995615c2-b3c3-530f-b2cb-5b29faf313ae'

export async function POST(req:Request) {

  return new Promise<any>(async (resolve, reject) => {

    const { partnerID } = await req.json();

    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
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