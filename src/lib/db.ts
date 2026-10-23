import fs from 'fs';
import path from 'path';
import {
  User,
  StudentProfile,
  AssessmentResult,
  CareerRecommendation,
  PersonalizedRoadmap,
  TaskItem,
  MentorFeedback,
} from './types';

interface DatabaseSchema {
  users: User[];
  profiles: Record<string, StudentProfile>;
  assessments: Record<string, AssessmentResult>;
  recommendations: Record<string, CareerRecommendation[]>;
  roadmaps: Record<string, PersonalizedRoadmap>;
  tasks: TaskItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// In-memory cache + file sync
let memoryDb: DatabaseSchema | null = null;

function ensureDbDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function getInitialDb(): DatabaseSchema {
  return {
    users: [],
    profiles: {},
    assessments: {},
    recommendations: {},
    roadmaps: {},
    tasks: [],
  };
}

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  ensureDbDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } catch (err) {
      console.error('Failed to parse database file, resetting to initial state', err);
      memoryDb = getInitialDb();
      saveDb(memoryDb);
      return memoryDb;
    }
  } else {
    memoryDb = getInitialDb();
    saveDb(memoryDb);
    return memoryDb;
  }
}

export function saveDb(db: DatabaseSchema): void {
  ensureDbDirectory();
  memoryDb = db;
  // Atomic write via temp file
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// ---------------- USER OPERATIONS ----------------
export function findUserByEmail(email: string): User | undefined {
  const db = getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const db = getDb();
  return db.users.find((u) => u.id === id);
}

export function createUser(user: User): User {
  const db = getDb();
  db.users.push(user);
  saveDb(db);
  return user;
}

export function getAllStudents(): User[] {
  const db = getDb();
  return db.users.filter((u) => u.role === 'student');
}

// ---------------- PROFILE OPERATIONS ----------------
export function getProfile(userId: string): StudentProfile | undefined {
  const db = getDb();
  return db.profiles[userId];
}

export function upsertProfile(profile: StudentProfile): StudentProfile {
  const db = getDb();
  db.profiles[profile.userId] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.profiles[profile.userId];
}

// ---------------- ASSESSMENT OPERATIONS ----------------
export function getAssessment(userId: string): AssessmentResult | undefined {
  const db = getDb();
  return db.assessments[userId];
}

export function saveAssessment(result: AssessmentResult): AssessmentResult {
  const db = getDb();
  db.assessments[result.userId] = result;
  saveDb(db);
  return result;
}

// ---------------- RECOMMENDATIONS OPERATIONS ----------------
export function getRecommendations(userId: string): CareerRecommendation[] {
  const db = getDb();
  return db.recommendations[userId] || [];
}

export function saveRecommendations(userId: string, recs: CareerRecommendation[]): CareerRecommendation[] {
  const db = getDb();
  db.recommendations[userId] = recs;
  saveDb(db);
  return recs;
}

// ---------------- ROADMAP OPERATIONS ----------------
export function getRoadmap(userId: string): PersonalizedRoadmap | undefined {
  const db = getDb();
  return db.roadmaps[userId];
}

export function saveRoadmap(roadmap: PersonalizedRoadmap): PersonalizedRoadmap {
  const db = getDb();
  db.roadmaps[roadmap.userId] = roadmap;
  saveDb(db);
  return roadmap;
}

// ---------------- TASK OPERATIONS ----------------
export function getTasksByUserId(userId: string): TaskItem[] {
  const db = getDb();
  return db.tasks.filter((t) => t.userId === userId);
}

export function getTaskById(taskId: string): TaskItem | undefined {
  const db = getDb();
  return db.tasks.find((t) => t.id === taskId);
}

export function createTask(task: TaskItem): TaskItem {
  const db = getDb();
  db.tasks.push(task);
  saveDb(db);
  return task;
}

export function createMultipleTasks(newTasks: TaskItem[]): TaskItem[] {
  const db = getDb();
  db.tasks.push(...newTasks);
  saveDb(db);
  return newTasks;
}

export function updateTask(taskId: string, updates: Partial<TaskItem>): TaskItem | undefined {
  const db = getDb();
  const index = db.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return undefined;

  db.tasks[index] = {
    ...db.tasks[index],
    ...updates,
  };
  saveDb(db);
  return db.tasks[index];
}

export function deleteTask(taskId: string, userId: string): boolean {
  const db = getDb();
  const initialLength = db.tasks.length;
  db.tasks = db.tasks.filter((t) => !(t.id === taskId && t.userId === userId));
  if (db.tasks.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ---------------- MENTOR OPERATIONS ----------------
export function getSubmissionsForMentor(): (TaskItem & { studentName?: string; studentEmail?: string })[] {
  const db = getDb();
  const submittedTasks = db.tasks.filter(
    (t) => t.status === 'submitted' || (t.status === 'completed' && t.submission)
  );

  return submittedTasks.map((t) => {
    const student = db.users.find((u) => u.id === t.userId);
    return {
      ...t,
      studentName: student ? student.name : 'Unknown Student',
      studentEmail: student ? student.email : undefined,
    };
  });
}

export function submitMentorFeedback(
  taskId: string,
  feedback: MentorFeedback
): TaskItem | undefined {
  const db = getDb();
  const index = db.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return undefined;

  const newStatus = feedback.status === 'approved' ? 'completed' : 'in_progress';
  db.tasks[index] = {
    ...db.tasks[index],
    status: newStatus,
    feedback: feedback,
  };
  saveDb(db);
  return db.tasks[index];
}

// ---------------- RECRUITER OPERATIONS ----------------
export function getSharedCandidates() {
  const db = getDb();
  const students = db.users.filter((u) => u.role === 'student');

  return students
    .filter((student) => {
      const profile = db.profiles[student.id];
      // Only include students who opted in to share with recruiters
      return profile && profile.shareWithRecruiters === true;
    })
    .map((student) => {
      const profile = db.profiles[student.id];
      const tasks = db.tasks.filter((t) => t.userId === student.id);
      const completedTasks = tasks.filter((t) => t.status === 'completed');
      const roadmap = db.roadmaps[student.id];
      const assessment = db.assessments[student.id];

      // Aggregate verified skills from completed tasks
      const verifiedSkills = Array.from(
        new Set(completedTasks.flatMap((t) => t.skills || []))
      );

      return {
        studentId: student.id,
        name: student.name,
        email: student.email,
        profile,
        targetCareer: roadmap ? roadmap.careerTitle : (profile.ambitions || 'Exploring Roles'),
        totalCompletedTasks: completedTasks.length,
        totalTasks: tasks.length,
        verifiedSkills,
        completedProjects: completedTasks.map((t) => ({
          taskId: t.id,
          title: t.title,
          projectUrl: t.submission?.projectUrl || '',
          screenshotUrl: t.submission?.screenshotUrl,
          notes: t.submission?.notes,
          mentorRating: t.feedback?.rating,
          mentorComment: t.feedback?.comment,
          mentorName: t.feedback?.mentorName,
          skills: t.skills || [],
          completedAt: t.submission?.submittedAt || t.createdAt,
        })),
        assessmentTraits: assessment?.dominantTraits || [],
      };
    });
}
