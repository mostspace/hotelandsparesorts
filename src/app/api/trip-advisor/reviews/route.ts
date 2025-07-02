import { NextResponse } from 'next/server'
const API_KEY = '424E337DAFE14BE58C36ACA2ED22B998'
const locationID = '17813462'
export function GET() {

    return new Promise(async (resolve, reject) => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const res = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${locationID}/reviews?key=${API_KEY}&language=en&limit=10`, options)
    const data = await res.json();
    resolve(NextResponse.json(data.data))

    })

}