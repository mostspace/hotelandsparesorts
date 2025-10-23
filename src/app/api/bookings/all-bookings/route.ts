import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { uid  } = await req.json();

    let approvedUsers = ['zuynyjOJ9qgPvD3ROkhAROoWYRH3','V5H33HzInaWTOi8jPuRHOk2MaqT2']

    if(!approvedUsers.includes(uid)){
      resolve(NextResponse.json({error:"You do not have permission to view this."}))
    }
    else{

    

    console.log("UID",uid)
    
    const booking = await prisma.bookings.findMany({
        include: { 
            hotel: {
              include: {
                images: {
                  take: 1 // 👈 only get first image
                }
              }
            },
            user:true
          }
      });
      
      resolve(NextResponse.json(booking))
    }

    })
  

}