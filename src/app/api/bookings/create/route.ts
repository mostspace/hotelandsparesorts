import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {


    const { bookingData,uid } = await req.json();

    let rooms:any[] = bookingData.rooms
    let adults = 0
    let children = 0

      rooms.forEach(room => {
          adults+=room.adults
          children+=room.children
      });
      
    const bookingCreateData: any = {
        order_id: bookingData.orderID,
        partner_id: bookingData.partnerID,
        hid: +bookingData.hid,
        check_in: new Date(bookingData.checkIn),
        check_out: new Date(bookingData.checkOut),
        adults: bookingData.adults,
        children: bookingData.children,
        amount: new Prisma.Decimal(bookingData.amount),
        currency_code: bookingData.currencyCode,
        status: 'pending',
        room_name: bookingData.roomName,
        amenities: bookingData.amenities.join(', '),
      };
    
      // Only add uid if provided and not empty
      if (uid && uid.trim() !== '') {
        bookingCreateData.uid = uid;
      }
    
      const booking = await prisma.bookings.create({
        data: bookingCreateData,
      });
      
      // booking.order_id is now your PID for /booking?pid=
      

      resolve(NextResponse.json(booking))

    })

}