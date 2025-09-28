import { NextResponse } from 'next/server'


export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

    const { orderID } = await req.json();

    console.log("ORDER ID", orderID)

    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/order/info/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID}:${process.env.NEXT_RATEHAWK_API_KEY}`)
        },
        body: JSON.stringify({
          ordering: {
            ordering_type: "desc",
            ordering_by: "created_at"
          },
          pagination: {
            page_size: "10",
            page_number: "1"
          },
          // search: {
          //   order_ids: [+orderID]
          // },
          language: "en"
        })
      });
      
      const data = await response.json();
      console.log(data);
      resolve(NextResponse.json(data))

    })

}