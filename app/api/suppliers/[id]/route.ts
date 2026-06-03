import { NextRequest, NextResponse } from 'next/server'
import { getSupplier, updateSupplier } from '@/lib/repository'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const s = getSupplier(params.id)
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(s)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const s = updateSupplier(params.id, body)
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(s)
}
