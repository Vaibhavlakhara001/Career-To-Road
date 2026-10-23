'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  AlertCircle,
  Share2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  Star,
  ShieldCheck,
  Code2,
  Check,
  Layers,
  Activity,
  Flame,
} from 'lucide-react';
import { StudentProfile, PersonalizedRoadmap, TaskItem } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [reportScore, setReportScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Live Interactive Active Tab in Curriculum
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'mentor') {
      router.push('/mentor');
      return;
    }
    if (user && user.role === 'recruiter') {
      router.push('/recruiter');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, roadmapRes, tasksRes, reportRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/roadmap'),
        fetch('/api/tasks'),
        fetch('/api/report'),
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.profile);
      }
      if (roadmapRes.ok) {
        const rData = await roadmapRes.json();
        setRoadmap(rData.roadmap);
      }
      if (tasksRes.ok) {
        const tData = await tasksRes.json();
        setTasks(tData.tasks || []);
      }
      if (reportRes.ok) {
        const repData = await reportRes.json();
        setReportScore(repData.report?.readinessScore || 0);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-md"></div>
          <p className="text-sm text-slate-500 font-semibold font-heading">
            Syncing your live career trajectory & verified portfolio...
          </p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingReviewTasks = tasks.filter((t) => t.status === 'submitted');
  const activeTasks = tasks.filter((t) => t.status === 'todo' || t.status === 'in_progress');

  const profileIncomplete = !profile?.qualification || profile.skills.length === 0;

  // SVG Radial Gauge Calculation (Radius 42, Circumference ~264)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (reportScore / 100) * circumference;

  // 5-Stage Visual Progression status
  const stages = [
    { id: 1, name: 'Student Profile', done: !profileIncomplete, href: '/profile', label: profileIncomplete ? 'Needs Details' : 'Completed' },
    { id: 2, name: 'Aptitude Quiz', done: Boolean(profile?.ambitions), href: '/assessment', label: 'Traits Evaluated' },
    { id: 3, name: 'Learning Roadmap', done: Boolean(roadmap), href: '/roadmap', label: roadmap ? roadmap.careerTitle : 'Pending Choice' },
    { id: 4, name: 'Practical Evidence', done: completedTasks.length > 0, href: '/tasks', label: `${completedTasks.length} Completed` },
    { id: 5, name: 'Recruiter Pool', done: Boolean(profile?.shareWithRecruiters), href: '/report', label: profile?.shareWithRecruiters ? 'Shared' : 'Private' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HERO BANNER WITH LIVE VISUALS & RADIAL READINESS GAUGE */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
        {/* Animated background ambient glow blobs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>● Live Career Telemetry Active</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
              Welcome back, <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-white bg-clip-text text-transparent">{user?.name}</span>!
            </h1>

            <p className="text-indigo-200/90 text-sm leading-relaxed max-w-xl">
              {roadmap
                ? `You are actively advancing along the "${roadmap.careerTitle}" learning pathway with ${completedTasks.length} verified project deliverables.`
                : 'Complete your student profile and take the career assessment to activate your personalized learning roadmap.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!roadmap ? (
                <Link
                  href="/assessment"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Take Career Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/roadmap"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Active Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/report"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5 backdrop-blur-sm"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Readiness Report</span>
              </Link>

              <Link
                href="/tasks"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5 backdrop-blur-sm"
              >
                <Code2 className="w-4 h-4 text-cyan-300" />
                <span>Submit Deliverable</span>
              </Link>
            </div>
          </div>

          {/* LIVE RADIAL READINESS SCORE RING VISUAL */}
          <div className="shrink-0 p-5 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-5 shadow-2xl">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Track Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-white/15"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Progress Radial Stroke */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#radialGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-heading text-white">{reportScore}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-200">Readiness</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Audit Verified</span>
              </div>
              <p className="text-[11px] text-indigo-200 leading-snug">
                {completedTasks.length} Practical Deliverables backed by code proof.
              </p>
              <Link
                href="/report"
                className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-2 flex items-center gap-1 pt-1"
              >
                <span>Full Audit Breakdown</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE INTERACTIVE 5-STAGE CAREER JOURNEY PIPELINE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Career Trajectory Journey Tracker</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive 5-stage progression from initial discovery to recruiter-backed employment.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Stage {stages.filter(s => s.done).length} of 5 Achieved
          </span>
        </div>

        {/* Horizontal Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {stages.map((stage, idx) => {
            return (
              <Link
                key={stage.id}
                href={stage.href}
                className={`p-3.5 rounded-xl border text-left transition-all relative group flex flex-col justify-between space-y-2 ${
                  stage.done
                    ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300'
                    : idx === stages.findIndex(s => !s.done)
                    ? 'border-indigo-300 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    stage.done
                      ? 'bg-emerald-600 text-white'
                      : idx === stages.findIndex(s => !s.done)
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stage.done ? '✓' : stage.id}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    stage.done ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {stage.done ? 'Done' : 'Active'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {stage.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{stage.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile Incomplete Notification Banner */}
      {profileIncomplete && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Your Student Profile is Incomplete</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Add your academic qualification, skills, hobbies, and career ambitions to receive high-precision AI career matches.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* 3. METRIC CARDS WITH LIVE STATUS AND PROGRESS BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Readiness Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Readiness Score</p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-heading">{reportScore}%</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${reportScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Real-time evidence calculation
          </p>
        </div>

        {/* Metric 2: Completed Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Projects</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-heading">{completedTasks.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Backed with code & screenshots</p>
          </div>
          <Link
            href="/portfolio"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Open Portfolio ({completedTasks.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 3: Pending Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</p>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-heading">{pendingReviewTasks.length}</h3>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Under mentor evaluation</p>
          </div>
          <Link
            href="/tasks"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Check Review Status</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric 4: Active Tasks To-Do */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Tasks To-Do</p>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-heading">{activeTasks.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Pending practical deliverables</p>
          </div>
          <Link
            href="/tasks"
            className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1"
          >
            <span>Go to Task Tracker</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. MAIN SPLIT: INTERACTIVE MILESTONES & UPCOMING DELIVERABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Curriculum with Interactive Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Current Learning Curriculum</h3>
                <p className="text-xs text-slate-500">
                  {roadmap ? roadmap.careerTitle : 'No target career selected yet'}
                </p>
              </div>
              {roadmap && (
                <Link
                  href="/roadmap"
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Full Curriculum</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {roadmap ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {roadmap.overview}
                </p>

                {/* Milestone Step Selector Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {roadmap.milestones.map((m, idx) => {
                    const isSelected = activeMilestoneIndex === idx;
                    const mTasks = tasks.filter((t) => t.milestoneId === m.id);
                    const doneCount = mTasks.filter((t) => t.status === 'completed').length;
                    const isAllDone = mTasks.length > 0 && doneCount === mTasks.length;

                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMilestoneIndex(idx)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isAllDone ? 'bg-emerald-600 text-white' : isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isAllDone ? '✓' : idx + 1}
                          </span>
                          <span className="text-[10px] text-slate-400">~{m.estimatedWeeks}w</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{m.title}</h5>
                      </button>
                    );
                  })}
                </div>

                {/* Active Milestone Live Detail Panel */}
                {roadmap.milestones[activeMilestoneIndex] && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Milestone #{roadmap.milestones[activeMilestoneIndex].order}: {roadmap.milestones[activeMilestoneIndex].title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {roadmap.milestones[activeMilestoneIndex].courses.length} Courses • {roadmap.milestones[activeMilestoneIndex].tasks.length} Deliverables
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {roadmap.milestones[activeMilestoneIndex].description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {roadmap.milestones[activeMilestoneIndex].courses.slice(0, 2).map((c, cIdx) => (
                        <a
                          key={cIdx}
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-semibold text-slate-800 truncate mr-2">{c.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 bg-slate-50/60 rounded-xl border border-dashed border-slate-300">
                <Compass className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">You haven't activated a career roadmap yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Take the quick assessment or browse career recommendations to pick your target path.
                </p>
                <div className="pt-2">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-250 transition-all"
                  >
                    Start Career Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Practical Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Upcoming Practical Tasks</h3>
                <p className="text-xs text-slate-500">Deliverables ready for code submission and mentor review</p>
              </div>
              <Link
                href="/tasks"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Task Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeTasks.length > 0 ? (
              <div className="space-y-3">
                {activeTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/tasks?open=${task.id}`}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      Submit Proof →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No open tasks pending. All deliverables completed or generated roadmap will populate here!
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Actions & Live Tools */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Navigation</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/profile"
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Edit Student Profile & Skills</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/assessment"
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Retake Career Interest Quiz</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/recommendations"
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Browse Matched Career Roles</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/portfolio"
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>View Public Evidence Portfolio</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/linkedin-generator"
                className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-xs font-bold text-indigo-900 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  AI LinkedIn Post Drafter
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-600" />
              </Link>
              <Link
                href="/report"
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 flex items-center justify-between text-xs font-bold text-amber-900 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Career Readiness Report
                </span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>
            </div>
          </div>

          {/* Recruiter Visibility Box */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-200 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm font-heading">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Recruiter Visibility Status</span>
            </div>
            <p className="text-xs text-indigo-800/90 leading-relaxed">
              {profile?.shareWithRecruiters
                ? 'Your readiness report is currently visible to vetted tech recruiters on the talent directory.'
                : 'Your readiness report is currently private. Employers cannot view your profile until you toggle sharing.'}
            </p>
            <div className="pt-1">
              <Link
                href="/report"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Manage Privacy in Report Settings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
