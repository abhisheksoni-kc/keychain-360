import { NextRequest, NextResponse } from 'next/server'
import { getProjects, createProject } from '@/lib/repository'

export async function GET() {
  return NextResponse.json(getProjects())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const project = createProject(body)
  return NextResponse.json(project, { status: 201 })
}
