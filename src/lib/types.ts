export type UserRole = 'student' | 'mentor' | 'recruiter';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  qualification: string;
  hobbies: string[];
  interests: string[];
  skills: string[];
  ambitions: string;
  futureGoals: string;
  preferredLanguage: string;
  linkedInUrl?: string;
  shareWithRecruiters: boolean;
  avatarUrl?: string;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  category: 'technical' | 'creative' | 'analytical' | 'interpersonal' | 'management';
  options: {
    label: string;
    trait: string;
    points: { [key: string]: number };
  }[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  dominantTraits: string[];
  scores: Record<string, number>;
  recommendedTracks: string[];
  completedAt: string;
}

export interface PracticalProject {
  title: string;
  description: string;
  deliverable: string;
  skills: string[];
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number;
  domain: string;
  explanation: string;
  reasons: string[];
  requiredSkills: string[];
  beginnerCourses: CourseResource[];
  practicalProjects: PracticalProject[];
  typicalRoles: string[];
  salaryRange: string;
  growthOutlook: string;
  alternativeOptions: string[];
  isRefinedByAssessment?: boolean;
}

export interface CourseResource {
  title: string;
  provider: string;
  url: string;
  free: boolean;
}

export interface LearningResource {
  title: string;
  type: 'Documentation' | 'Video Tutorial' | 'Interactive Sandbox' | 'Article' | 'Cheatsheet';
  url: string;
}

export interface RoadmapMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  courses: CourseResource[];
  resources: LearningResource[];
  tasks: {
    title: string;
    description: string;
    practicalGoal: string;
    skills: string[];
  }[];
}

export interface PersonalizedRoadmap {
  id: string;
  userId: string;
  careerTitle: string;
  generatedAt: string;
  overview: string;
  milestones: RoadmapMilestone[];
}

export interface TaskSubmission {
  projectUrl: string;
  screenshotUrl?: string;
  notes: string;
  submittedAt: string;
}

export interface MentorFeedback {
  id: string;
  mentorId: string;
  mentorName: string;
  rating: number; // 1-5
  comment: string;
  reviewedAt: string;
  status: 'approved' | 'revision_requested';
}

export interface TaskItem {
  id: string;
  userId: string;
  roadmapId?: string;
  milestoneId?: string;
  title: string;
  description: string;
  deadline: string;
  skills: string[];
  status: 'todo' | 'in_progress' | 'submitted' | 'completed';
  submission?: TaskSubmission;
  feedback?: MentorFeedback;
  createdAt: string;
}

export interface CareerReadinessReport {
  studentId: string;
  studentName: string;
  targetCareer: string;
  readinessScore: number;
  totalTasksCompleted: number;
  totalTasksSubmitted: number;
  skillsDemonstrated: string[];
  completedProjects: {
    taskId: string;
    title: string;
    description?: string;
    projectUrl: string;
    screenshotUrl?: string;
    notes?: string;
    skills: string[];
    mentorRating?: number;
    mentorComment?: string;
    mentorName?: string;
    completedAt: string;
  }[];
  mentorReviews?: {
    taskId: string;
    taskTitle: string;
    mentorName: string;
    rating: number;
    comment: string;
    reviewedAt: string;
  }[];
  strengths: string[];
  suggestedNextSteps: string[];
  shareWithRecruiters: boolean;
  lastUpdated: string;
}
