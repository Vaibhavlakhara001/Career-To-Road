import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTaskById, getRoadmap, getProfile } from '@/lib/db';
import { generateLinkedInPost } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { taskId, customTaskTitle, customSkills, customNotes, customProjectUrl } = await req.json();

    let taskTitle = customTaskTitle;
    let skills = Array.isArray(customSkills) ? customSkills : [];
    let projectUrl = customProjectUrl || '';
    let notes = customNotes || '';
    let feedback = undefined;

    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        if (task.userId !== user.id && user.role === 'student') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        taskTitle = task.title;
        skills = task.skills || [];
        projectUrl = task.submission?.projectUrl || customProjectUrl || '';
        notes = task.submission?.notes || task.description || '';
        if (task.feedback) {
          feedback = {
            rating: task.feedback.rating,
            comment: task.feedback.comment,
            mentorName: task.feedback.mentorName,
          };
        }
      }
    }

    if (!taskTitle) {
      return NextResponse.json({ error: 'Task title is required to generate a post.' }, { status: 400 });
    }

    const roadmap = getRoadmap(user.id);
    const profile = getProfile(user.id);
    const targetCareer = roadmap?.careerTitle || profile?.ambitions || 'Tech Innovator';

    const aiResult = await generateLinkedInPost({
      studentName: user.name,
      taskTitle,
      skills,
      projectUrl,
      notes,
      targetCareer,
      feedback,
    });

    return NextResponse.json({
      success: true,
      draftPost: aiResult.data,
      engineUsed: aiResult.engineUsed,
      isRealAi: aiResult.isRealAi,
      label: aiResult.label,
    });
  } catch (error) {
    console.error('LinkedIn AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate LinkedIn post.' }, { status: 500 });
  }
}
