import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTaskById, submitMentorFeedback } from '@/lib/db';
import { MentorFeedback } from '@/lib/types';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only mentors (or admin/demo mentor) can review and provide feedback
  if (user.role !== 'mentor') {
    return NextResponse.json({ error: 'Access restricted: Only mentors can review submissions.' }, { status: 403 });
  }

  const task = getTaskById(params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
  }

  if (!task.submission) {
    return NextResponse.json({ error: 'Cannot review a task without an active student submission.' }, { status: 400 });
  }

  try {
    const { rating, comment, status = 'approved' } = await req.json();

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5.' }, { status: 400 });
    }

    if (!comment || String(comment).trim().length < 5) {
      return NextResponse.json({ error: 'Please provide meaningful constructive feedback (at least 5 characters).' }, { status: 400 });
    }

    const feedback: MentorFeedback = {
      id: `feedback-${Date.now()}`,
      mentorId: user.id,
      mentorName: user.name,
      rating: numericRating,
      comment: String(comment).trim(),
      status: status === 'revision_requested' ? 'revision_requested' : 'approved',
      reviewedAt: new Date().toISOString(),
    };

    const updatedTask = submitMentorFeedback(params.id, feedback);

    return NextResponse.json({
      success: true,
      message: status === 'approved' ? 'Submission approved with feedback!' : 'Revision requested from student.',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to record mentor feedback.' }, { status: 500 });
  }
}
