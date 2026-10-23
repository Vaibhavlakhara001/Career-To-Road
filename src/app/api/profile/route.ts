import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getProfile, upsertProfile } from '@/lib/db';
import { StudentProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = getProfile(user.id) || {
    userId: user.id,
    fullName: user.name,
    qualification: '',
    hobbies: [],
    interests: [],
    skills: [],
    ambitions: '',
    futureGoals: '',
    preferredLanguage: 'English',
    shareWithRecruiters: false,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Clean arrays and strings
    const parseList = (item: any): string[] => {
      if (Array.isArray(item)) return item.map(String).map((s) => s.trim()).filter(Boolean);
      if (typeof item === 'string') {
        return item
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const updatedProfile: StudentProfile = {
      userId: user.id,
      fullName: data.fullName ? String(data.fullName).trim() : user.name,
      qualification: data.qualification ? String(data.qualification).trim() : '',
      hobbies: parseList(data.hobbies),
      interests: parseList(data.interests),
      skills: parseList(data.skills),
      ambitions: data.ambitions ? String(data.ambitions).trim() : '',
      futureGoals: data.futureGoals ? String(data.futureGoals).trim() : '',
      preferredLanguage: data.preferredLanguage ? String(data.preferredLanguage).trim() : 'English',
      linkedInUrl: data.linkedInUrl ? String(data.linkedInUrl).trim() : undefined,
      shareWithRecruiters: Boolean(data.shareWithRecruiters),
      avatarUrl: data.avatarUrl ? String(data.avatarUrl).trim() : undefined,
      updatedAt: new Date().toISOString(),
    };

    const saved = upsertProfile(updatedProfile);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
