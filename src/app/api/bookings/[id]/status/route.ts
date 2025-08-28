import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    context: any   // 👈 loosen type here
  ) {
    

    const id = +context.params.id;
    const { action } = await request.json();

  

    return new Promise<any>(async (resolve, reject) => {

        const booking = await prisma.bookings.findUnique({
            where: { order_id: id },
          });

        
        let status = booking?.status
        let newStatus = ""

        if(action === "Voucher Refunded"){

          if(status?.includes("Payment Refunded")){newStatus = "Voucher and Payment Refunded"}
          else if((booking?.amount_paid||0) > 0){newStatus = "Payment needs Refunding (Voucher Refunded)"}
          else{
            newStatus = "Voucher Refunded"
          }
        }
        else if(action === "Payment Refunded"){

          if(status?.includes("Voucher Refunded")){newStatus = "Voucher and Payment Refunded"}
          else if(booking?.voucher_used){newStatus = "Voucher needs Refunding (Payment Refunded)"}
          else{
            newStatus = "Payment Refunded"
          }
        }

        await prisma.bookings.update({
            where: { order_id: id},
            data: {
              status: newStatus,
            },
          });
          
        resolve(NextResponse.json({status:newStatus}))

    })

}


