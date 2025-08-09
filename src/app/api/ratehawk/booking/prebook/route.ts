import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

const bookHash = 'h-385e0081-7650-54a1-ad38-d065b8681495'

export function GET(req:Request) {

    return new Promise<any>(async (resolve, reject) => {



    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/prebook/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
        },
        body: JSON.stringify({
          hash: bookHash
        })
      });
      
      const data = await response.json();
      console.log(data);
      resolve(NextResponse.json(data))

    })

}