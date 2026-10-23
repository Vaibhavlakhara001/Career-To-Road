import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTaskById, updateTask } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = getTaskById(params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
  }

  if (task.userId !== user.id) {
    return NextResponse.json({ error: 'You can only submit evidence for your own tasks.' }, { status: 403 });
  }

  try {
    const { projectUrl, screenshotUrl, notes, markAsCompleted = true } = await req.json();

    if (!projectUrl && !screenshotUrl) {
      return NextResponse.json({ error: 'Please provide either a project repository/live link or a screenshot.' }, { status: 400 });
    }

    const submission = {
      projectUrl: projectUrl ? String(projectUrl).trim() : '',
      screenshotUrl: screenshotUrl ? String(screenshotUrl).trim() : undefined,
      notes: notes ? String(notes).trim() : '',
      submittedAt: new Date().toISOString(),
    };

    const updatedTask = updateTask(params.id, {
      status: markAsCompleted ? 'completed' : 'submitted',
      submission,
    });

    return NextResponse.json({
      success: true,
      message: markAsCompleted
        ? 'Project completed and evidence saved to your portfolio!'
        : 'Project evidence submitted successfully! Awaiting mentor review.',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to process task submission.' }, { status: 500 });
  }
}
