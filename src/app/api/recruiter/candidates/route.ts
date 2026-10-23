import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getSharedCandidates } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only recruiters (or mentors/evaluators) can access candidate directory
  if (user.role !== 'recruiter' && user.role !== 'mentor') {
    return NextResponse.json({ error: 'Access restricted: Recruiter account required.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const skillQuery = searchParams.get('skill')?.toLowerCase() || '';
  const roleQuery = searchParams.get('role')?.toLowerCase() || '';

  let candidates = getSharedCandidates();

  if (skillQuery) {
    candidates = candidates.filter((c) =>
      c.verifiedSkills.some((s) => s.toLowerCase().includes(skillQuery)) ||
      (c.profile?.skills || []).some((s: string) => s.toLowerCase().includes(skillQuery))
    );
  }

  if (roleQuery) {
    candidates = candidates.filter((c) =>
      c.targetCareer.toLowerCase().includes(roleQuery)
    );
  }

  return NextResponse.json({ candidates });
}
