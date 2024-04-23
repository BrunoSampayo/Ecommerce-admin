import { getUserId } from '@/data/user'
import prismadb from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const userId = getUserId()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()

    const { name } = body
    if (!name) return new NextResponse('Name is required', { status: 400 })

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    })
    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.log('[STORES_POST', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
