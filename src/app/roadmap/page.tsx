'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Compass,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  ChevronRight,
  Video,
  FileCode,
  AlertCircle,
  UploadCloud,
  Check,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  Star,
  Award,
} from 'lucide-react';
import { PersonalizedRoadmap, TaskItem } from '@/lib/types';

export default function RoadmapPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMilestoneTab, setActiveMilestoneTab] = useState(0);

  // Evidence Submission Modal State
  const [submittingTask, setSubmittingTask] = useState<TaskItem | null>(null);
  const [projectUrl, setProjectUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [markCompleteCheckbox, setMarkCompleteCheckbox] = useState(true);
  const [submittingEvidence, setSubmittingEvidence] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadRoadmap();
    }
  }, [user, authLoading, router]);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/roadmap');
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Error fetching roadmap', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (task: TaskItem) => {
    setSubmittingTask(task);
    setProjectUrl(task.submission?.projectUrl || '');
    setScreenshotUrl(task.submission?.screenshotUrl || '');
    setNotes(task.submission?.notes || '');
    setMarkCompleteCheckbox(true);
    setModalSuccess('');
    setModalError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setModalError('Screenshot file size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
        setModalError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    setModalError('');
    setModalSuccess('');
    setSubmittingEvidence(true);

    try {
      const res = await fetch(`/api/tasks/${submittingTask.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectUrl,
          screenshotUrl,
          notes,
          markAsCompleted: markCompleteCheckbox,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit evidence');
      }

      setModalSuccess(data.message || 'Evidence saved! Work added to your portfolio.');
      await loadRoadmap();
      setTimeout(() => {
        setSubmittingTask(null);
      }, 1500);
    } catch (err: any) {
      setModalError(err.message || 'Error uploading evidence');
    } finally {
      setSubmittingEvidence(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadRoadmap();
      }
    } catch (e) {
      console.error('Failed to toggle task status', e);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Loading your personalized curriculum...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">No Active Learning Roadmap Found</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Choose a target career role to generate a complete 4-milestone curriculum loaded with courses, resources, and practical project tasks.
          </p>
        </div>
        <Link
          href="/recommendations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-250 transition-all"
        >
          <span>Explore Career Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentMilestone = roadmap.milestones[activeMilestoneTab] || roadmap.milestones[0];

  // Overall roadmap progress
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Roadmap Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> Personalized Curriculum Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {roadmap.careerTitle} Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            {roadmap.overview}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="/portfolio"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-250 transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-emerald-200" />
            <span>View Verified Portfolio ({completedTasksCount})</span>
          </Link>
          <Link
            href="/recommendations"
            className="px-4 py-2.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-xs border border-indigo-700 transition-colors"
          >
            Switch Career Track
          </Link>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Overall Roadmap Practical Deliverables Progress</span>
          </span>
          <span className="font-bold text-indigo-600">
            {completedTasksCount} of {totalTasksCount} Practical Tasks Completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Milestone Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roadmap.milestones.map((m, idx) => {
          const isActive = activeMilestoneTab === idx;
          const milestoneTasks = tasks.filter((t) => t.milestoneId === m.id || t.title.toLowerCase().includes(m.tasks[0]?.title?.toLowerCase() || ''));
          const isDone = milestoneTasks.length > 0 && milestoneTasks.every((t) => t.status === 'completed');

          return (
            <button
              key={m.id}
              onClick={() => setActiveMilestoneTab(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                isActive
                  ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">~{m.estimatedWeeks}w</span>
              </div>
              <h3 className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-indigo-950' : 'text-slate-700'}`}>
                {m.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Milestone Details Card */}
      {currentMilestone && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Milestone #{currentMilestone.order} of {roadmap.milestones.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {currentMilestone.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {currentMilestone.description}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold shrink-0 self-start sm:self-auto flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Estimated Duration: ~{currentMilestone.estimatedWeeks} Weeks
            </div>
          </div>

          {/* 3 Sections: Courses, Resources, Practical Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Recommended Courses */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Recommended Courses</span>
              </h3>

              <div className="space-y-3">
                {currentMilestone.courses.map((course, cIdx) => (
                  <a
                    key={cIdx}
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {course.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>{course.provider}</span>
                      <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                        course.free ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {course.free ? 'Free / Audit' : 'Paid / Certificate'}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 2. Curated Learning Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-600" />
                <span>Documentation & Guides</span>
              </h3>

              <div className="space-y-3">
                {currentMilestone.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-purple-50/40 hover:border-purple-200 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {res.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
                    </div>
                    <div className="text-[11px] text-purple-700 font-semibold mt-2">
                      {res.type}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* 3. Practical Tasks & Evidence Deliverables (Connected to Database) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Practical Deliverables & Evidence</span>
              </h3>

              <div className="space-y-4">
                {currentMilestone.tasks.map((task, tIdx) => {
                  // Find connected live database task item
                  const liveTask = tasks.find(
                    (t) =>
                      t.title.trim().toLowerCase() === task.title.trim().toLowerCase() ||
                      t.milestoneId === currentMilestone.id
                  ) || {
                    id: `task-${roadmap.id}-${currentMilestone.id}-${tIdx}`,
                    userId: user?.id || '',
                    title: task.title,
                    description: task.description,
                    deadline: '',
                    skills: task.skills || [],
                    status: 'todo' as const,
                    createdAt: new Date().toISOString(),
                  };

                  const isCompleted = liveTask.status === 'completed';
                  const isSubmitted = liveTask.status === 'submitted';

                  return (
                    <div
                      key={tIdx}
                      className={`p-4 rounded-2xl border space-y-3 transition-all ${
                        isCompleted
                          ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-500/10'
                          : isSubmitted
                          ? 'border-indigo-300 bg-indigo-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Task Status Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isSubmitted
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isCompleted ? '✓ Completed' : isSubmitted ? 'Under Review' : 'To-Do'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{task.title}</h4>
                        </div>

                        {/* Quick Mark Complete Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleTaskStatus(liveTask.id, liveTask.status)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                        >
                          <Check className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-700 font-black' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800">
                        <strong>Target Deliverable:</strong> {task.practicalGoal}
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1">
                        {task.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Display Submitted Proof if present */}
                      {liveTask.submission && (
                        <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs space-y-1">
                          <p className="font-bold text-emerald-800 text-[11px]">Submitted Proof:</p>
                          {liveTask.submission.projectUrl && (
                            <a
                              href={liveTask.submission.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px] truncate"
                            >
                              <LinkIcon className="w-3 h-3 shrink-0" />
                              <span className="truncate">{liveTask.submission.projectUrl}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          )}
                          {liveTask.submission.screenshotUrl && (
                            <div className="pt-1">
                              <img
                                src={liveTask.submission.screenshotUrl}
                                alt="Project proof"
                                className="max-h-24 w-full object-cover rounded border border-slate-200"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button: Upload Evidence */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenSubmitModal(liveTask)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isCompleted
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{liveTask.submission ? 'Update Evidence' : 'Upload Evidence'}</span>
                        </button>

                        {isCompleted && (
                          <Link
                            href="/portfolio"
                            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            <span>Portfolio</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL (SCREENSHOT & PROJECT LINK) */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Project Evidence</h3>
                <p className="text-xs text-slate-500">Attach verifiable proof of your practical deliverable</p>
              </div>
              <button
                onClick={() => setSubmittingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900">Deliverable: </span>
              <span className="text-slate-700">{submittingTask.title}</span>
            </div>

            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{modalSuccess}</span>
              </div>
            )}
            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              {/* Project Link Input */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Project Repository or Live App URL *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://github.com/your-username/repo-name or live URL"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Screenshot File Upload & URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Screenshot or Deliverable Image Proof
                </label>

                {/* File picker */}
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <UploadCloud className="w-6 h-6 text-indigo-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">
                      Click or drag image file here to upload screenshot
                    </p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>

                {/* Or URL input */}
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={screenshotUrl.startsWith('data:') ? '' : screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                {/* Preview Thumbnail */}
                {screenshotUrl && (
                  <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={screenshotUrl}
                        alt="Screenshot preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <span className="text-xs text-slate-600 font-medium">Screenshot loaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreenshotUrl('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Implementation Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Implementation Notes & Learnings
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key technical decisions, libraries used, or hurdles debugged."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              {/* Mark Complete Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="markCompleteCheck"
                  checked={markCompleteCheckbox}
                  onChange={(e) => setMarkCompleteCheckbox(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="markCompleteCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Mark task as completed and showcase in my portfolio immediately
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEvidence}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 disabled:opacity-50"
                >
                  {submittingEvidence ? 'Saving Evidence...' : 'Save Evidence & Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
