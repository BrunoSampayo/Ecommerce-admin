import { NextResponse } from 'next/server'
import { getUserId } from '@/data/user'
import prismadb from '@/lib/prismadb'
import console from 'console'

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const userId = getUserId()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json()
    const { label, imageUrl } = body

    if (!label) {
      return new NextResponse('Label is required', { status: 400 })
    }
    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 })
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard, { status: 200 })
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const userId = getUserId()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.billboardId) {
      return new NextResponse('BillBoard id is required', { status: 400 })
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

    const billboard = await prismadb.billboard.delete({
      where: { id: params.billboardId },
    })
    return NextResponse.json(billboard, { status: 200 })
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } },
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('BillBoard id is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    })
    return NextResponse.json(billboard, { status: 200 })
  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
