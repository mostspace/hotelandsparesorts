import { NextResponse } from 'next/server'


export function GET(req:Request) {

    const { searchParams } = new URL(req.url);
    const voucherID = searchParams.get("voucherID");


    return new Promise<any>(async (resolve, reject) => {

    // const options = {method: 'GET', headers: {accept: 'application/json'}};

    
    const url = 'https://www.hotelandsparesorts.com/api/vouchers';


    console.log("WE HERE")

    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // If authentication is required, add your token here:
            // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        });

        console.log(response)
        // Parse the response
        const result = await response.json();

        if (response.ok) {
        // Success: handle result
        console.log('Vouchers:', result);



        var found = false
        var voucher 

        result.forEach((element: any) => {
            
            if(element.voucher_code === voucherID){
                found = true
                voucher = element
            }
        });

      

        if(+voucher.balance === 0){
            resolve(NextResponse.json({found,error:"No remaining balance on voucher"}))
        }
        else if(new Date(voucher.expiry_date) < new Date()){

            let split = voucher.expiry_date.split("-")
            let expiry = split[2]+'-'+split[1]+'-'+split[0]

            resolve(NextResponse.json({found,error:`The voucher expired on ${expiry}. Previously, it had been valid for 5 years.`}))

        }else{
            resolve(NextResponse.json({found,voucher}))
        }


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