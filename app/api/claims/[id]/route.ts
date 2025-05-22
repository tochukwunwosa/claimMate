import { NextResponse } from 'next/server'
import { getClaim } from '@/action/claim'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Claim ID is required' },
      { status: 400 }
    )
  }
  const result = await getClaim(id);
  return NextResponse.json(result);
}
