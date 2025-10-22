import { NextResponse } from 'next/server'


export async function POST(req:Request) {

  return new Promise<any>(async (resolve, reject) => {

    const { partnerID,personalDetails,amount,currencyCode,rooms } = await req.json();

    let guestArray:any[] = []
    rooms.forEach((element:any) => {
        console.log(element)
        guestArray.push({guests:[{ first_name: personalDetails.firstName, last_name: personalDetails.lastName }]})
    });

    const response = await fetch('https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_RATEHAWK_KEY_ID_PREMIUM}:${process.env.NEXT_RATEHAWK_API_KEY_PREMIUM}`)
        },
        body: JSON.stringify({
          user: {
            email: 'adrienne@hotelandsparesorts.com',//personalDetails.email,
            comment: personalDetails.specialRequest,
            phone: personalDetails.phoneNumber,
          },
          supplier_data: {
            first_name_original: personalDetails.firstName,
            last_name_original: personalDetails.lastName,
            phone: personalDetails.phoneNumber,
            email: personalDetails.email,
          },
          partner: {
            partner_order_id: partnerID,
            // comment: "The partner comment.",
            // amount_sell_b2b2c: "10", //This will appear on the invoice they receive, perhaps good for when using voucher
          },
          language: "en",
          rooms: guestArray,
          // upsell_data: [
          //   {
          //     name: "early_checkin",
          //     uid: "d7b56e81-b874-40ee-b195-e2f73d1ec714",
          //   },
          //   {
          //     name: "late_checkout",
          //     uid: "c4013ea8-3ffd-4eee-bbbc-37693670031e",
          //   },
          // ],
          payment_type: {
            type: "deposit",
            amount: amount,
            currency_code: currencyCode,
          },
          return_path: "https://example.com",
        })
      });
      
      const data = await response.json();
      console.log(data);
      resolve(NextResponse.json(data))

   })
}