import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateProduct } from '@/lib/repository'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const product = getProduct(params.id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const product = updateProduct(params.id, body)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}
