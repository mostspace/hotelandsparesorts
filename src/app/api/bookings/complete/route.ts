import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { bookingID,amountPaid,voucherUsed,uid,personalDetails,stripeID  } = await req.json();

    try {
    
      const updateData: any = {
        status: "complete",
        amount_paid: +amountPaid
      };
  
      if (voucherUsed && voucherUsed.trim() !== "") {
        updateData.voucher_used = voucherUsed;
      }

      if(personalDetails){
        updateData.email = personalDetails.email;
      }

      if(stripeID !== ""){
        updateData.stripe_id = stripeID;
      }

      if(uid !== ""){
        updateData.uid = uid;
      }
  
      const updatedBooking = await prisma.bookings.update({
        where: { order_id: bookingID },
        data: updateData
      });
    
    
      

      resolve(NextResponse.json(updatedBooking))

    } catch (err) {
        console.error('Complete Error:', err);
      }

    })

}