

import { sendTemplateEmail } from "@/utils/email";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  

  try {
    await sendTemplateEmail("caolangm@gmail.com", "HS Booking Confirmation Template V2", {
        FIRST_NAME: "Caolan",
        HOTEL_NAME: "The Grand Hotel",
        BOOKING_ID: "12345",
        ROOMS_COUNT: 2,
        ROOMS_TYPE: "Deluxe Suite",
        GUESTS_COUNT: 3,
        ADULTS_COUNT: 2,
        CHILDREN_COUNT: 1,
        CHECKIN_DATE: '22-02-25',
        CHECKOUT_DATE: '23-02-25',
        CANCEL_NOTE:"Free Cancellation",
        CANCEL_URL:"https://booking.hotelandsparesorts.com/cancellations",
        TOTAL_AMOUNT:"€250.00",
        PDF_LINK: "http://localhost:3000/api/ratehawk/pdf?partnerID=f4hcszw8",
        SUPPORT_EMAIL:"cgm@gmail.com",
        SUPPORT_PHONE:"123124125"

    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

