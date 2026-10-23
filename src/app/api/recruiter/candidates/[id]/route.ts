import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { findUserById, getProfile, getRoadmap, getTasksByUserId, getAssessment } from '@/lib/db';
import { CareerReadinessReport } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role !== 'recruiter' && user.role !== 'mentor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const targetUser = findUserById(params.id);
  if (!targetUser) {
    return NextResponse.json({ error: 'Student candidate not found' }, { status: 404 });
  }

  const profile = getProfile(targetUser.id);
  if (!profile || !profile.shareWithRecruiters) {
    return NextResponse.json({ error: 'This student candidate has not opted to make their report public.' }, { status: 403 });
  }

  const roadmap = getRoadmap(targetUser.id);
  const tasks = getTasksByUserId(targetUser.id);
  const assessment = getAssessment(targetUser.id);

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const skillsDemonstrated = Array.from(
    new Set(completedTasks.flatMap((t) => t.skills || []))
  );

  let score = 30;
  if (assessment) score += 15;
  if (roadmap) score += 15;
  if (tasks.length > 0) {
    score += Math.round((completedTasks.length / tasks.length) * 40);
  }
  score = Math.min(score, 100);

  const actualMentorReviews = tasks
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
    studentId: targetUser.id,
    studentName: targetUser.name,
    targetCareer: roadmap?.careerTitle || profile.ambitions || 'Software Engineer',
    readinessScore: score,
    totalTasksCompleted: completedTasks.length,
    totalTasksSubmitted: tasks.filter((t) => t.status === 'submitted' || t.status === 'completed').length,
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
    mentorReviews: actualMentorReviews,
    strengths: [
      skillsDemonstrated.length > 0 ? `Demonstrated hands-on proficiency in: ${skillsDemonstrated.join(', ')}` : 'Self-directed learner',
      'Verified submission links with code repositories and live demos',
      'Curriculum roadmap progression tracked',
    ],
    suggestedNextSteps: ['Technical interview scheduling', 'Portfolio code walk-through review'],
    shareWithRecruiters: true,
    lastUpdated: profile.updatedAt,
  };

  return NextResponse.json({ candidate: report, profile });
}
