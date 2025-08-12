import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { uid  } = await req.json();

    console.log("UID",uid)
    
    const booking = await prisma.bookings.findMany({
        where: { uid: uid },
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