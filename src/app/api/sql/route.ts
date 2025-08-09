import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'
export async function POST(request:Request) {


    const options = {method: 'GET', headers: {accept: 'application/json'}};

        const { hotelIds } = await request.json();

        if (!Array.isArray(hotelIds)) {
        return NextResponse.json({ error: 'hotelIds must be an array' }, { status: 400 });
        }

        const hotels = await prisma.hotels.findMany({
        where: {
            hid: {
            in: hotelIds,
            },
        },
        });
      
        NextResponse.json(hotels)

    

}
