import { NextRequest, NextResponse } from 'next/server'
import { getSuppliersByProject, createSupplier } from '@/lib/repository'

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  return NextResponse.json(getSuppliersByProject(projectId))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supplier = createSupplier(body)
  return NextResponse.json(supplier, { status: 201 })
}
