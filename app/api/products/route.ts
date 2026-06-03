import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct, getProductFilters } from '@/lib/repository'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const result = getProducts({
    search: searchParams.get('search') ?? undefined,
    stage: searchParams.get('stage') ?? undefined,
    brand: searchParams.get('brand') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    page: parseInt(searchParams.get('page') ?? '1'),
    pageSize: parseInt(searchParams.get('pageSize') ?? '10'),
  })
  const filters = getProductFilters()
  return NextResponse.json({ ...result, filters })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const product = createProduct(body)
  return NextResponse.json(product, { status: 201 })
}
