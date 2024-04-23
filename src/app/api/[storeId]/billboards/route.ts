import { getUserId } from '@/data/user'
import prismadb from '@/lib/prismadb'
import console from 'console'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const userId = getUserId()
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })

    const body = await req.json()

    const { label, imageUrl } = body
    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }
    if (!imageUrl) {
      return new NextResponse('Image Url is required', { status: 400 })
    }
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const storeBelongsUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })
    if (!storeBelongsUser) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    })
    return NextResponse.json(billboard, { status: 201 })
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    })
    return NextResponse.json(billboard, { status: 201 })
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
