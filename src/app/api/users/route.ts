import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export function GET(req:Request) {

    const { searchParams } = new URL(req.url);


    return new Promise<any>(async (resolve, reject) => {


    resolve(NextResponse.json("done"))

    })

}



export function POST(req:Request) {

    return new Promise<any>(async (resolve, reject) => {

        const { userID, email } = await req.json();

        const user = await prisma.users.create({
           data: {
                uid: userID,
                email: email
           }
        })

        resolve(NextResponse.json(user))

    })

}