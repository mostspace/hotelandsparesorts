import { NextResponse } from 'next/server'


export async function POST(req:Request) {


    const { searchParams } = new URL(req.url);

    const body = await req.json();

    let data = {sp:searchParams.get("test"),body:body.test}
    
    NextResponse.json(data)


}