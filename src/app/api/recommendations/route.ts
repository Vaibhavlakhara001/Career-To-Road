import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getProfile, getAssessment, getRecommendations, saveRecommendations } from '@/lib/db';
import { generateCareerRecommendations } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existingRecs = getRecommendations(user.id);
  const assessment = getAssessment(user.id);

  return NextResponse.json({
    recommendations: existingRecs,
    hasAssessment: !!assessment,
    dominantTraits: assessment?.dominantTraits || [],
  });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = getProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Please complete your student profile first.' }, { status: 400 });
    }

    const assessment = getAssessment(user.id);
    const aiResult = await generateCareerRecommendations(profile, assessment);

    // Save recommendations persistently to the student's account
    saveRecommendations(user.id, aiResult.data);

    return NextResponse.json({
      success: true,
      recommendations: aiResult.data,
      engineUsed: aiResult.engineUsed,
      isRealAi: aiResult.isRealAi,
      label: aiResult.label,
      hasAssessment: !!assessment,
      dominantTraits: assessment?.dominantTraits || [],
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations.' }, { status: 500 });
  }
}
