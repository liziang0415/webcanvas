import { NextResponse } from 'next/server'
import { readEntries } from '@/lib/devlog'

export async function GET() {
  return NextResponse.json(await readEntries())
}
