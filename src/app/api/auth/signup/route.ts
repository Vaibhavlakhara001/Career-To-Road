import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, upsertProfile } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role = 'student' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (!['student', 'mentor', 'recruiter'].includes(role)) {
      return NextResponse.json({ error: 'Invalid user role.' }, { status: 400 });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newUser = createUser({
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role as UserRole,
      createdAt: new Date().toISOString(),
    });

    // Initialize blank student profile if role is student
    if (role === 'student') {
      upsertProfile({
        userId,
        fullName: name.trim(),
        qualification: '',
        hobbies: [],
        interests: [],
        skills: [],
        ambitions: '',
        futureGoals: '',
        preferredLanguage: 'English',
        shareWithRecruiters: false,
        updatedAt: new Date().toISOString(),
      });
    }

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });

    // Set secure cookie
    response.cookies.set({
      name: 'roadtocareer_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error during registration.' }, { status: 500 });
  }
}
