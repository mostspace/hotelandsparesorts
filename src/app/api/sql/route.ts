import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server'
export function POST(request:Request) {

    return new Promise(async (resolve, reject) => {

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
      
        resolve(NextResponse.json(hotels))

    })

}
