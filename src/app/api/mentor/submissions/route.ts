import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSubmissionsForMentor } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'mentor') {
    return NextResponse.json({ error: 'Access restricted to mentors.' }, { status: 403 });
  }

  const submissions = getSubmissionsForMentor();
  return NextResponse.json({ submissions });
}
