import { NextResponse } from 'next/server'



export async function GET(req:Request) {
  return new Promise<any>(async (resolve, reject) => {


    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/reviews/dump/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID}:${process.env.NEXT_RATEHAWK_API_KEY}`)
        },
        body: JSON.stringify({
          inventory: "all",
          language: "en",
        })
      });

      const data = await response.json();
      console.log(data);
      resolve(NextResponse.json(data))
       


    })
}