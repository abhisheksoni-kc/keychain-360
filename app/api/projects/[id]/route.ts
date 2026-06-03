import { NextRequest, NextResponse } from 'next/server'
import { getProject, getSuppliersByProject } from '@/lib/repository'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const project = getProject(params.id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const suppliers = getSuppliersByProject(params.id)
  return NextResponse.json({ ...project, suppliers })
}
