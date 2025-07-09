import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY


export async function GET(req:Request) {
  return new Promise(async (resolve, reject) => {


    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/region/dump/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${KEY_ID}:${API_KEY}`)
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