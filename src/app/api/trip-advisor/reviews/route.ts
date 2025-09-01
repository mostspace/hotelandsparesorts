import { NextResponse } from 'next/server'
const API_KEY = '424E337DAFE14BE58C36ACA2ED22B998'
export function GET(req:Request) {

    const { searchParams } = new URL(req.url);
    const locationID = searchParams.get("locationID");


    return new Promise<any>(async (resolve, reject) => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const res = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${locationID}/reviews?key=${API_KEY}&language=en&limit=10`, options)
    const data = await res.json();

    const res2 = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${locationID}/details?key=${API_KEY}&language=en&currency=USD`,options);
    const data2 = await res2.json();
   



    resolve(NextResponse.json({reviews:data.data,general:data2}))

    })

}