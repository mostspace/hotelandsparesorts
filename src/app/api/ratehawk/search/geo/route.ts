import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function GET(req:Request) {

    return new Promise(async (resolve, reject) => {

      const { searchParams } = new URL(req.url);

      const body = await req.json();


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
          longitude: 13.38886,
          latitude: 52.517036,
          radius: 150,
          currency: "EUR"
        })
      });
      
      const data = await response.json();
      console.log(data);
    resolve(NextResponse.json(data))

    })

}