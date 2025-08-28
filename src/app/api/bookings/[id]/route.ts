import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: any   // 👈 loosen type here
  ) {
    

    const id = context.params.id;

    return new Promise<any>(async (resolve, reject) => {

        const booking = await prisma.bookings.findUnique({
            where: { order_id: id },
          });
          
        resolve(NextResponse.json(booking))

    })

}


