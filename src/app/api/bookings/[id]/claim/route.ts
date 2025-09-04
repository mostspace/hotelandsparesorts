import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    context: any   // 👈 loosen type here
  ) {
    

    const id = +context.params.id;
    const { uid } = await request.json();

  

    return new Promise<any>(async (resolve, reject) => {

        const booking = await prisma.bookings.findUnique({
            where: { order_id: id },
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

        if(!booking){
          resolve(NextResponse.json({error:true,errorMessage:"Error: Could not find any booking with this number"}))
        }
        else if(booking.uid === uid){
          resolve(NextResponse.json({error:true,errorMessage:"Error: This booking is already connected to your account"}))
        }
        else if(booking.uid !== null){
          resolve(NextResponse.json({error:true,errorMessage:"Error: This booking is already connected to a different account"}))
        }
        else{
            await prisma.bookings.update({
              where: { order_id: id},
              data: {
                uid: uid,
              },
            });
            
          resolve(NextResponse.json({error:false,booking}))
        }
        
          

        

    })

}


