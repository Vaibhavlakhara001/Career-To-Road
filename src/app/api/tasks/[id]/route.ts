import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTaskById, updateTask, deleteTask } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = getTaskById(params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Allow access if student owns it, or if user is mentor/recruiter
  if (task.userId !== user.id && user.role === 'student') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const task = getTaskById(params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Student owns the task, or mentor can review
  if (task.userId !== user.id && user.role !== 'mentor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const updates = await req.json();
    const updated = updateTask(params.id, updates);
    return NextResponse.json({ success: true, task: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const success = deleteTask(params.id, user.id);
  if (!success) {
    return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Task deleted.' });
}
