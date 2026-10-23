import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getProfile, getRoadmap, getTasksByUserId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const profile = user.role === 'student' ? getProfile(user.id) : null;
    const roadmap = user.role === 'student' ? getRoadmap(user.id) : null;
    const tasks = user.role === 'student' ? getTasksByUserId(user.id) : [];

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile,
      hasActiveRoadmap: !!roadmap,
      activeCareer: roadmap?.careerTitle || null,
      stats: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.status === 'completed').length,
        pendingReviewTasks: tasks.filter((t) => t.status === 'submitted').length,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
