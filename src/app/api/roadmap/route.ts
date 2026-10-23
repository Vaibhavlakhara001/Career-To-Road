import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getProfile, getRoadmap, saveRoadmap, createMultipleTasks, getTasksByUserId } from '@/lib/db';
import { generateRoadmap } from '@/lib/ai-engine';
import { TaskItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const roadmap = getRoadmap(user.id);
  const tasks = getTasksByUserId(user.id);

  return NextResponse.json({
    roadmap: roadmap || null,
    tasks: tasks,
    tasksCount: tasks.length,
    completedTasksCount: tasks.filter((t) => t.status === 'completed').length,
  });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { careerTitle } = await req.json();
    if (!careerTitle) {
      return NextResponse.json({ error: 'Career title is required to generate a roadmap.' }, { status: 400 });
    }

    const profile = getProfile(user.id);
    const aiResult = await generateRoadmap(careerTitle, user.id, profile);
    const savedRoadmap = saveRoadmap(aiResult.data);

    // Populate practical tasks into student's task tracker if not already present
    const existingTasks = getTasksByUserId(user.id);
    const newTasks: TaskItem[] = [];

    savedRoadmap.milestones.forEach((milestone, mIdx) => {
      milestone.tasks.forEach((t, tIdx) => {
        const taskId = `task-${savedRoadmap.id}-${milestone.id}-${tIdx}`;
        // Only add if not already tracked
        if (!existingTasks.some((et) => et.title === t.title)) {
          // Compute a reasonable deadline (e.g., 2 weeks * order)
          const deadlineDate = new Date();
          deadlineDate.setDate(deadlineDate.getDate() + (mIdx + 1) * 14);

          newTasks.push({
            id: taskId,
            userId: user.id,
            roadmapId: savedRoadmap.id,
            milestoneId: milestone.id,
            title: t.title,
            description: `${t.description} \n\nTarget Deliverable: ${t.practicalGoal}`,
            deadline: deadlineDate.toISOString().split('T')[0],
            skills: t.skills || [],
            status: 'todo',
            createdAt: new Date().toISOString(),
          });
        }
      });
    });

    if (newTasks.length > 0) {
      createMultipleTasks(newTasks);
    }

    return NextResponse.json({
      success: true,
      roadmap: savedRoadmap,
      generatedTasksCount: newTasks.length,
      engineUsed: aiResult.engineUsed,
      isRealAi: aiResult.isRealAi,
      label: aiResult.label,
    });
  } catch (error) {
    console.error('Roadmap error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap.' }, { status: 500 });
  }
}
