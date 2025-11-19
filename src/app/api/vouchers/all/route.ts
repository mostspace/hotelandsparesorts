import { NextResponse } from 'next/server'

export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

    const { uid  } = await req.json();

    let approvedUsers = ['noG2YUOFrectuRqSZtAXKKlm0nT2', 'zuynyjOJ9qgPvD3ROkhAROoWYRH3','V5H33HzInaWTOi8jPuRHOk2MaqT2','7RfA1m304LMgM8AnlTbykdX2oCV2','5a9rzlKdreaDYFUOZdRCEof1iml2']

    if(!approvedUsers.includes(uid)){
      resolve(NextResponse.json({error:"You do not have permission to view this."}))
    }
    else{

    console.log("UID",uid)
    
    const url = 'https://www.hotelandsparesorts.com/api/vouchers';

    try {
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });

        // Parse the response
        const result = await response.json();

        if (response.ok) {
        // Success: handle result
        console.log('Vouchers:', result);
        resolve(NextResponse.json(result))
        } else {
        // Error: handle error message
        console.error('Error getting vouchers:', result.message || result);
        resolve(NextResponse.json({error: result.message || 'Failed to fetch vouchers'}))
        }
    } catch (error) {
        console.error('Network or server error:', error);
        resolve(NextResponse.json({error:error}))
    }
    }

    })

}

