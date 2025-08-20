import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: any   // 👈 loosen type here
  ) {
    const uid = context.params.id;

    return new Promise<any>(async (resolve, reject) => {

        const user = await prisma.users.findUnique({
            where: { uid: uid },
          });
          

        resolve(NextResponse.json(user))

    })

}


