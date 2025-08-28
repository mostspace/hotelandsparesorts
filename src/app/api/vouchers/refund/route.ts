import { NextResponse } from 'next/server'


export function POST(req:Request) {
    


    return new Promise<any>(async (resolve, reject) => {


    
    const url = 'https://www.hotelandsparesorts.com/api/vouchers/refund';

    const { voucherCode,amount } = await req.json();


    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // If authentication is required, add your token here:
            // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify({ voucherCode, amount }),
        });


        // Parse the response
        const result = await response.json();

        if (response.ok) {
        // Success: handle result
        console.log('Vouchers:', result);
        resolve(NextResponse.json(result))

        } else {
        // Error: handle error message
        console.error('Error getting voucher:', result.message || result);
        resolve(NextResponse.json(result))
        }
    } catch (error) {
        console.error('Network or server error:', error);
        resolve(NextResponse.json({error:error}))

    }
    


    })

}