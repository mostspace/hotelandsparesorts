import { NextResponse } from 'next/server'
const API_KEY = '424E337DAFE14BE58C36ACA2ED22B998'
const locationID = '17813462'
export function GET() {

    return new Promise(async (resolve, reject) => {

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    const res = await fetch(`https://api.content.tripadvisor.com/api/v1/location/search?key=${API_KEY}&searchQuery=Dublin&category=hotels&latLong=53.342683635187676%2C%20-6.277462452500411&radius=1&radiusUnit=km&language=en`, options)
    const data = await res.json();
    resolve(NextResponse.json(data.data))

    })

}