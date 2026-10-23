import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getTasksByUserId, createTask } from '@/lib/db';
import { TaskItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = getTasksByUserId(user.id);
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, deadline, skills } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });
    }

    const parseList = (item: any): string[] => {
      if (Array.isArray(item)) return item.map(String).map((s) => s.trim()).filter(Boolean);
      if (typeof item === 'string') return item.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      deadline: deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      skills: parseList(skills),
      status: 'todo',
      createdAt: new Date().toISOString(),
    };

    const saved = createTask(newTask);
    return NextResponse.json({ success: true, task: saved });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}
