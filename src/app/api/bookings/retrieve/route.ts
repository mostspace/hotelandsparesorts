import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { bookingID  } = await req.json();

    
    const booking = await prisma.bookings.findUnique({
        where: { order_id: bookingID },
        include: { 
            hotel: {
              include: {
                images: {
                  take: 1 // 👈 only get first image
                }
              }
            }
          }
      });
      
      resolve(NextResponse.json(booking))

    })

}