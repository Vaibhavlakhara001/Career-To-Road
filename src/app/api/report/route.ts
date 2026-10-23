import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getProfile, getRoadmap, getTasksByUserId, upsertProfile, getAssessment } from '@/lib/db';
import { CareerReadinessReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = getProfile(user.id);
  const roadmap = getRoadmap(user.id);
  const tasks = getTasksByUserId(user.id);
  const assessment = getAssessment(user.id);

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const submittedTasks = tasks.filter((t) => t.status === 'submitted' || t.status === 'completed');

  // Collect verified skills
  const skillsDemonstrated = Array.from(
    new Set(completedTasks.flatMap((t) => t.skills || []))
  );

  // Calculate readiness score (weighted calculation based on tasks, roadmap milestones, and verified submissions)
  let score = 25; // baseline profile creation
  if (assessment) score += 15;
  if (roadmap) score += 10;
  if (tasks.length > 0) {
    const taskRatio = completedTasks.length / tasks.length;
    score += Math.round(taskRatio * 40);
  }
  // Mentor rated boost
  const reviewedCount = completedTasks.filter((t) => t.feedback?.rating).length;
  if (reviewedCount > 0) {
    score += Math.min(reviewedCount * 5, 10);
  }
  score = Math.min(score, 100);

  // Suggested next steps
  const suggestedNextSteps: string[] = [];
  if (!assessment) {
    suggestedNextSteps.push('Take the Career Interest Assessment to validate your natural aptitude.');
  }
  if (!roadmap) {
    suggestedNextSteps.push('Select a target career track and generate a personalized 4-stage roadmap.');
  }
  const pendingTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress');
  if (pendingTasks.length > 0) {
    suggestedNextSteps.push(`Complete your active practical task: "${pendingTasks[0].title}".`);
  }
  if (completedTasks.length < 3) {
    suggestedNextSteps.push('Build and submit at least 3 verifiable portfolio projects for mentor review.');
  }
  if (completedTasks.length >= 2 && !(profile?.shareWithRecruiters)) {
    suggestedNextSteps.push('Enable "Share Report with Recruiters" to showcase your evidence to hiring partners.');
  }
  if (suggestedNextSteps.length === 0) {
    suggestedNextSteps.push('Generate a public LinkedIn post to showcase your capstone project to hiring managers!');
  }

  // Collect actual mentor feedback received on student's tasks
  const actualMentorFeedbacks = tasks
    .filter((t) => t.feedback && t.feedback.rating)
    .map((t) => ({
      taskId: t.id,
      taskTitle: t.title,
      mentorName: t.feedback!.mentorName,
      rating: t.feedback!.rating,
      comment: t.feedback!.comment,
      reviewedAt: t.feedback!.reviewedAt,
    }));

  const report: CareerReadinessReport = {
    studentId: user.id,
    studentName: user.name,
    targetCareer: roadmap?.careerTitle || profile?.ambitions || 'General Technology',
    readinessScore: score,
    totalTasksCompleted: completedTasks.length,
    totalTasksSubmitted: submittedTasks.length,
    skillsDemonstrated,
    completedProjects: completedTasks.map((t) => ({
      taskId: t.id,
      title: t.title,
      description: t.description,
      projectUrl: t.submission?.projectUrl || '',
      screenshotUrl: t.submission?.screenshotUrl,
      notes: t.submission?.notes,
      skills: t.skills || [],
      mentorRating: t.feedback?.rating,
      mentorComment: t.feedback?.comment,
      mentorName: t.feedback?.mentorName,
      completedAt: t.submission?.submittedAt || t.createdAt,
    })),
    mentorReviews: actualMentorFeedbacks,
    strengths: [
      skillsDemonstrated.length > 0 ? `Demonstrated hands-on command over ${skillsDemonstrated.slice(0, 3).join(', ')}` : 'Initiative in self-directed learning',
      assessment ? `Strong alignment with ${assessment.dominantTraits.slice(0, 2).join(' & ')} domains` : 'Broad exploratory technical interest',
      completedTasks.length > 0 ? 'Documented evidence of end-to-end project completion' : 'Proactive roadmap progression',
    ],
    suggestedNextSteps,
    shareWithRecruiters: profile?.shareWithRecruiters || false,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({ report, profile });
}

export async function PATCH(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { shareWithRecruiters } = await req.json();
    let profile = getProfile(user.id);
    if (!profile) {
      profile = {
        userId: user.id,
        fullName: user.name,
        qualification: '',
        hobbies: [],
        interests: [],
        skills: [],
        ambitions: '',
        futureGoals: '',
        preferredLanguage: 'English',
        shareWithRecruiters: Boolean(shareWithRecruiters),
        updatedAt: new Date().toISOString(),
      };
    } else {
      profile.shareWithRecruiters = Boolean(shareWithRecruiters);
      profile.updatedAt = new Date().toISOString();
    }

    const updated = upsertProfile(profile);

    return NextResponse.json({
      success: true,
      shareWithRecruiters: updated.shareWithRecruiters,
      message: updated.shareWithRecruiters
        ? 'Your readiness report is now visible to vetted tech recruiters!'
        : 'Your readiness report is now private.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update visibility.' }, { status: 500 });
  }
}
