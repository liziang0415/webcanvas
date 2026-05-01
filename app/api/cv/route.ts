import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'Ziang_Li_CV.pdf')
  try {
    const file = await fs.readFile(filePath)
    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ziang_Li_CV.pdf"',
      },
    })
  } catch {
    return NextResponse.json({ error: 'CV not found' }, { status: 404 })
  }
}
