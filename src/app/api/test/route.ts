import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello from Spa API!' })
}

export async function POST(request: Request) {
    const body = await request.json();
    
    console.log("Received POST data:", body);
  
    return NextResponse.json({ message: "POST received", user: body.name });
  }