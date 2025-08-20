import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } // 👈 works if you don't destructure in the signature
  ) {
    const uid = params.id;

    return new Promise<any>(async (resolve, reject) => {

        const user = await prisma.users.findUnique({
            where: { uid: uid },
          });
          

        resolve(NextResponse.json(user))

    })

}


