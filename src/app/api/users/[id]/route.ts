import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: any   // 👈 loosen type here
  ) {
    
    let approvedUsers = ['zuynyjOJ9qgPvD3ROkhAROoWYRH3','V5H33HzInaWTOi8jPuRHOk2MaqT2','7RfA1m304LMgM8AnlTbykdX2oCV2']

    const uid = context.params.id;

    return new Promise<any>(async (resolve, reject) => {

        const user:any = await prisma.users.findUnique({
            where: { uid: uid },
          });
          
        if(user){
          user.isAdmin = approvedUsers.includes(uid)
        }  

        resolve(NextResponse.json(user))

    })

}


