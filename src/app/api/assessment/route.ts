import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAssessment, saveAssessment, getProfile, saveRecommendations } from '@/lib/db';
import { getQuestionsForProfile, TRACK_DETAILS } from '@/lib/assessment-data';
import { generateCareerRecommendations } from '@/lib/ai-engine';
import { AssessmentResult } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = getProfile(user.id);
  const { questions, domainLabel, domainKey } = getQuestionsForProfile(profile);
  const existingResult = getAssessment(user.id);

  return NextResponse.json({
    questions,
    domainLabel,
    domainKey,
    savedResult: existingResult || null,
    trackDetails: TRACK_DETAILS,
  });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { answers } = await req.json(); // Record<number, number> questionId -> optionIndex

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers submitted.' }, { status: 400 });
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

    const { questions, domainLabel } = getQuestionsForProfile(profile);

    // Tally track scores across all 10 tracks
    const trackScores: Record<string, number> = {
      game_development: 0,
      business_management: 0,
      business_analytics: 0,
      digital_marketing_growth: 0,
      software_engineering: 0,
      data_ai: 0,
      ui_ux_design: 0,
      cloud_devops: 0,
      cybersecurity: 0,
      product_management: 0,
    };

    questions.forEach((q) => {
      const selectedOptionIdx = answers[q.id];
      if (typeof selectedOptionIdx === 'number' && q.options[selectedOptionIdx]) {
        const option = q.options[selectedOptionIdx];
        for (const [track, pts] of Object.entries(option.weights)) {
          trackScores[track] = (trackScores[track] || 0) + pts;
        }
      }
    });

    // Determine top 2-3 tracks
    const sortedTracks = Object.entries(trackScores)
      .sort((a, b) => b[1] - a[1])
      .map(([track]) => track);

    const dominantTraits = sortedTracks.slice(0, 2).map((key) => TRACK_DETAILS[key]?.title || key);
    const recommendedTracks = sortedTracks.slice(0, 3);

    const assessmentResult: AssessmentResult = {
      id: `assessment-${Date.now()}`,
      userId: user.id,
      dominantTraits,
      scores: trackScores,
      recommendedTracks,
      completedAt: new Date().toISOString(),
    };

    // Save assessment result to student's account
    const saved = saveAssessment(assessmentResult);

    // Refine and save career recommendations to student's account
    const refinedResult = await generateCareerRecommendations(profile, assessmentResult);
    const savedRecs = saveRecommendations(user.id, refinedResult.data);

    return NextResponse.json({
      success: true,
      result: saved,
      domainLabel,
      refinedRecommendations: savedRecs,
      engineLabel: refinedResult.label,
      topTracks: recommendedTracks.map((k) => TRACK_DETAILS[k]),
    });
  } catch (error) {
    console.error('Error scoring assessment:', error);
    return NextResponse.json({ error: 'Failed to process assessment.' }, { status: 500 });
  }
}
