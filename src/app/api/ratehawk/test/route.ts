import { NextResponse } from 'next/server'

const KEY_ID = '13324'
const API_KEY = '66a9de03-3f16-4287-b594-fc9191a3669a' ///RATEHAWK API KEY

export function POST(req:Request) {

    return new Promise(async (resolve, reject) => {

    const { searchParams } = new URL(req.url);

    const body = await req.json();

    let data = {sp:searchParams.get("test"),body:body.test}
    
    resolve(NextResponse.json(data))

    })

}