import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, upsertProfile, saveRoadmap, createTask } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Demo Mentor
    let mentor = findUserByEmail('demo.mentor@roadtocareer.internal');
    if (!mentor) {
      const hash = await hashPassword('MentorPass123!');
      mentor = createUser({
        id: 'user-demo-mentor',
        name: 'Dr. Sarah Jenkins (Senior Mentor)',
        email: 'demo.mentor@roadtocareer.internal',
        passwordHash: hash,
        role: 'mentor',
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Demo Recruiter
    let recruiter = findUserByEmail('demo.recruiter@roadtocareer.internal');
    if (!recruiter) {
      const hash = await hashPassword('RecruiterPass123!');
      recruiter = createUser({
        id: 'user-demo-recruiter',
        name: 'Alex Rivera (Tech Talent Partner)',
        email: 'demo.recruiter@roadtocareer.internal',
        passwordHash: hash,
        role: 'recruiter',
        createdAt: new Date().toISOString(),
      });
    }

    // 3. Demo Student (Clearly labelled as Sample Data)
    let sampleStudent = findUserByEmail('sample.student@roadtocareer.internal');
    if (!sampleStudent) {
      const hash = await hashPassword('StudentPass123!');
      sampleStudent = createUser({
        id: 'user-sample-student',
        name: '[Sample Demo] Maya Lin',
        email: 'sample.student@roadtocareer.internal',
        passwordHash: hash,
        role: 'student',
        createdAt: new Date().toISOString(),
      });

      upsertProfile({
        userId: sampleStudent.id,
        fullName: '[Sample Demo] Maya Lin',
        qualification: 'B.S. in Computer Information Systems (Final Year)',
        hobbies: ['Robotics Club', 'Open Source Contributing', 'Chess'],
        interests: ['Full-Stack Engineering', 'API Design', 'Cloud Architecture'],
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Docker'],
        ambitions: 'Land a full-time Full-Stack Software Engineering position at an innovative tech product company.',
        futureGoals: 'Build high-scale distributed backend services and design intuitive web frontends.',
        preferredLanguage: 'English',
        linkedInUrl: 'https://linkedin.com/in/sample-maya-lin-demo',
        shareWithRecruiters: true,
        updatedAt: new Date().toISOString(),
      });

      // Sample Roadmap
      saveRoadmap({
        id: 'roadmap-sample-student',
        userId: sampleStudent.id,
        careerTitle: 'Full-Stack Software Engineer',
        generatedAt: new Date().toISOString(),
        overview: 'Sample progression demonstrating the 4-phase mastery path for modern web engineering.',
        milestones: [
          {
            id: 'm-1',
            order: 1,
            title: 'Modern Frontend & TypeScript Foundations',
            description: 'Core web fundamentals, React component state architecture, and accessible Tailwind styling.',
            estimatedWeeks: 3,
            courses: [
              { title: 'The Modern JavaScript Tutorial', provider: 'javascript.info', url: 'https://javascript.info/', free: true },
              { title: 'Full Stack Open', provider: 'Univ. of Helsinki', url: 'https://fullstackopen.com/en/', free: true }
            ],
            resources: [
              { title: 'React Official Documentation', type: 'Documentation', url: 'https://react.dev' },
              { title: 'Tailwind CSS Docs', type: 'Documentation', url: 'https://tailwindcss.com' }
            ],
            tasks: [
              {
                title: 'Responsive Dashboard Web Application',
                description: 'Build an accessible responsive dashboard with filtering and dark mode.',
                practicalGoal: 'Live demo repository with clean TypeScript components.',
                skills: ['React', 'TypeScript', 'Tailwind CSS']
              }
            ]
          }
        ]
      });

      // Sample Completed Task with real Mentor Review by Dr. Sarah Jenkins
      createTask({
        id: 'task-sample-1',
        userId: sampleStudent.id,
        title: 'Full-Stack REST API with Authentication',
        description: 'Design and deploy a backend REST API with JWT authentication, rate limiting, and relational schema.',
        deadline: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        skills: ['Node.js', 'Express', 'JWT', 'PostgreSQL', 'Docker'],
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        submission: {
          projectUrl: 'https://github.com/sample-student-demo/rest-auth-api',
          screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
          notes: 'Built a modular REST service using Node.js, bcrypt, and JWT auth cookies. Validated with automated Jest integration tests.',
          submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        feedback: {
          id: 'feedback-sample-1',
          mentorId: mentor.id,
          mentorName: mentor.name,
          rating: 5,
          comment: 'Excellent architectural separation of controllers and services. Test suite is thorough and documentation is clear!',
          reviewedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
          status: 'approved',
        }
      });

      // Sample Pending Submission waiting for Mentor review
      createTask({
        id: 'task-sample-2',
        userId: sampleStudent.id,
        title: 'Interactive Real-Time Collaborative Canvas',
        description: 'Build a multi-user interactive canvas using WebSockets / Socket.io with conflict resolution.',
        deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        skills: ['WebSockets', 'React Canvas', 'State Sync'],
        status: 'submitted',
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        submission: {
          projectUrl: 'https://github.com/sample-student-demo/realtime-canvas',
          screenshotUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
          notes: 'Implemented broadcast room logic for cursors and live vector drawing. Tested with 10 concurrent browser sessions.',
          submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Demo accounts and clearly labelled sample demonstration data are ready.',
      accounts: [
        { role: 'Student', email: 'sample.student@roadtocareer.internal', password: 'StudentPass123!' },
        { role: 'Mentor', email: 'demo.mentor@roadtocareer.internal', password: 'MentorPass123!' },
        { role: 'Recruiter', email: 'demo.recruiter@roadtocareer.internal', password: 'RecruiterPass123!' },
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed demo accounts' }, { status: 500 });
  }
}
