'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  UploadCloud,
  X,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageSquare,
  Star,
  Share2,
  Check,
  Award,
} from 'lucide-react';
import { TaskItem } from '@/lib/types';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Submit Evidence Modal State
  const [submittingTask, setSubmittingTask] = useState<TaskItem | null>(null);
  const [projectUrl, setProjectUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [markCompleteCheckbox, setMarkCompleteCheckbox] = useState(true);
  const [submittingEvidence, setSubmittingEvidence] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadTasks();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const openId = searchParams.get('open');
    if (openId && tasks.length > 0) {
      const match = tasks.find((t) => t.id === openId);
      if (match && match.status !== 'completed') {
        handleOpenSubmitModal(match);
      }
    }
  }, [searchParams, tasks]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Error fetching tasks', e);
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
    setModalError('');
    setModalSuccess('');
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

      setModalSuccess(data.message || 'Evidence saved! Deliverable updated.');
      await loadTasks();
      setTimeout(() => {
        setSubmittingTask(null);
      }, 1500);
    } catch (err: any) {
      setModalError(err.message || 'Error uploading submission');
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
        await loadTasks();
      }
    } catch (e) {
      console.error('Failed to toggle task status', e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          deadline: newDeadline,
          skills: newSkills,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewDeadline('');
        setNewSkills('');
        await loadTasks();
      }
    } catch (e) {
      console.error('Error creating custom task', e);
    } finally {
      setCreatingTask(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Loading practical task tracker...</p>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Practical Task & Project Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track milestones, mark practical tasks complete, upload verified deliverables (screenshots & repository links), and review mentor feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/portfolio"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Portfolio ({completedCount})</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-250 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Custom Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Tasks', count: tasks.length },
            { id: 'todo', label: 'To-Do', count: tasks.filter((t) => t.status === 'todo').length },
            { id: 'in_progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'in_progress').length },
            { id: 'submitted', label: 'Under Review', count: tasks.filter((t) => t.status === 'submitted').length },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTasks.length} of {tasks.length} total deliverables
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isSubmitted = task.status === 'submitted';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isSubmitted
                    ? 'border-indigo-200 bg-indigo-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 max-w-2xl">
                    {/* Completion Checkbox Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleTaskStatus(task.id, task.status)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 hover:border-indigo-500 bg-white'
                      }`}
                      title={isCompleted ? 'Mark as to-do' : 'Mark complete'}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCompleted && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-600" /> Under Review
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            In Progress
                          </span>
                        )}
                        {task.status === 'todo' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            To-Do
                          </span>
                        )}

                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Due: {task.deadline || 'Flexible'}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold text-slate-900 ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {task.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
                    {task.submission && (
                      <div className="text-xs space-y-1 text-right">
                        {task.submission.projectUrl && (
                          <a
                            href={task.submission.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Project Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {task.submission.screenshotUrl && (
                          <div>
                            <a
                              href={task.submission.screenshotUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-[11px]"
                            >
                              <ImageIcon className="w-3 h-3" /> View Screenshot
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSubmitModal(task)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                          task.submission
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{task.submission ? 'Update Evidence' : 'Submit Evidence'}</span>
                      </button>

                      {isCompleted && (
                        <>
                          <Link
                            href="/portfolio"
                            className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                          >
                            In Portfolio →
                          </Link>
                          <button
                            onClick={() => router.push(`/linkedin-generator?taskId=${task.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1"
                            title="Draft LinkedIn post with AI"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Post
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {task.feedback && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Feedback by {task.feedback.mentorName}
                        </span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < task.feedback!.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(task.feedback.reviewedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      "{task.feedback.comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm space-y-2">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No tasks in this category</p>
            <p className="text-xs text-slate-400">
              Generate a roadmap or click "Add Custom Task" to create your next deliverable.
            </p>
          </div>
        )}
      </div>

      {/* Submit Evidence Modal */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Project Evidence</h3>
                <p className="text-xs text-slate-500">Provide tangible evidence of your practical execution</p>
              </div>
              <button
                onClick={() => setSubmittingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900">Task: </span>
              <span className="text-slate-700">{submittingTask.title}</span>
            </div>

            {modalSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                ✓ {modalSuccess}
              </div>
            )}
            {modalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                ⚠ {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Project Repository or Live Demo URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://github.com/username/project or live demo URL"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Screenshot Proof (Upload File or Image URL)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                      <span>Choose Screenshot File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">PNG, JPG, WebP under 5MB</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>

                  {screenshotUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-50 flex items-center justify-center p-2">
                      <img
                        src={screenshotUrl}
                        alt="Screenshot Preview"
                        className="max-h-36 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl('')}
                        className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 text-xs"
                        title="Remove screenshot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Reflections & Implementation Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail the technical decisions made, libraries used, and hurdles you debugged."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/60 border border-indigo-150">
                <input
                  type="checkbox"
                  id="taskMarkComplete"
                  checked={markCompleteCheckbox}
                  onChange={(e) => setMarkCompleteCheckbox(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="taskMarkComplete" className="text-xs text-indigo-900 font-medium cursor-pointer">
                  Mark task as <strong>Completed immediately</strong> and display in verified portfolio
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  {submittingEvidence ? 'Saving...' : 'Save & Submit Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Custom Project Task</h3>
                <p className="text-xs text-slate-500">Track an independent coding or research deliverable</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build an API Rate Limiter in Go"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                  Description & Deliverable Instructions
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what needs to be created and the goal deliverable."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                    Skills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="Go, Redis, Concurrency"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 disabled:opacity-50"
                >
                  {creatingTask ? 'Adding...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}