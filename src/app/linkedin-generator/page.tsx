'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Linkedin,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  Award,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import { TaskItem } from '@/lib/types';

function LinkedInGeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customSkills, setCustomSkills] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [customProjectUrl, setCustomProjectUrl] = useState('');

  const [draftPost, setDraftPost] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engineLabel, setEngineLabel] = useState('');
  const [isRealAi, setIsRealAi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadTasks();
    }
  }, [user, authLoading, router]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        const tList: TaskItem[] = data.tasks || [];
        setTasks(tList);

        const initialTaskId = searchParams.get('taskId');
        if (initialTaskId) {
          const match = tList.find((t) => t.id === initialTaskId);
          if (match) {
            setSelectedTaskId(initialTaskId);
            generatePost(initialTaskId);
            return;
          }
        }

        const completed = tList.find((t) => t.status === 'completed' || t.submission);
        if (completed) {
          setSelectedTaskId(completed.id);
          generatePost(completed.id);
        } else if (tList.length > 0) {
          setSelectedTaskId(tList[0].id);
          generatePost(tList[0].id);
        } else {
          setSelectedTaskId('custom');
        }
      }
    } catch (e) {
      console.error('Error fetching tasks for LinkedIn generator', e);
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async (taskIdToUse?: string) => {
    setGenerating(true);
    setCopied(false);
    try {
      const payload: any = {};
      const id = taskIdToUse || selectedTaskId;

      if (id && id !== 'custom') {
        payload.taskId = id;
      } else {
        payload.customTaskTitle = customTitle;
        payload.customSkills = customSkills.split(',').map((s) => s.trim()).filter(Boolean);
        payload.customNotes = customNotes;
        payload.customProjectUrl = customProjectUrl;
      }

      const res = await fetch('/api/ai/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate LinkedIn post');
      }

      setDraftPost(data.draftPost || '');
      setEngineLabel(data.label || '');
      setIsRealAi(Boolean(data.isRealAi));
    } catch (err: any) {
      alert(err.message || 'Error generating LinkedIn post');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!draftPost) return;
    navigator.clipboard.writeText(draftPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Preparing AI LinkedIn post creator...</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const aVal = a.status === 'completed' ? 2 : a.submission ? 1 : 0;
    const bVal = b.status === 'completed' ? 2 : b.submission ? 1 : 0;
    return bVal - aVal;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">AI LinkedIn Post Drafter</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {engineLabel || (isRealAi ? 'Gemini 1.5 Flash' : 'High-Impact Template Engine')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Turn completed projects, verified skills, and lessons learned into polished, engagement-ready LinkedIn updates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/portfolio"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Portfolio
          </Link>
          <Link
            href="/report"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            Readiness Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Deliverable Selection & Details */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Select Completed Project
            </h3>

            {tasks.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Choose from Saved Tasks & Deliverables
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => {
                    setSelectedTaskId(e.target.value);
                    if (e.target.value !== 'custom') {
                      generatePost(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {sortedTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.status === 'completed'
                        ? '✓ [Completed] '
                        : t.submission
                        ? '⏳ [Submitted] '
                        : '• '}
                      {t.title}
                    </option>
                  ))}
                  <option value="custom">-- Custom Milestone / Independent Project --</option>
                </select>
              </div>
            )}

            {/* Display metadata about currently selected task */}
            {selectedTask && selectedTaskId !== 'custom' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-600">Skills Practiced: </span>
                  <span className="text-indigo-700 font-medium">
                    {selectedTask.skills?.join(', ') || 'General Engineering'}
                  </span>
                </div>
                {selectedTask.submission?.notes && (
                  <div>
                    <span className="font-semibold text-slate-600">Lessons Learned: </span>
                    <span className="text-slate-700 italic">"{selectedTask.submission.notes}"</span>
                  </div>
                )}
                {selectedTask.submission?.projectUrl && (
                  <div className="flex items-center gap-1 text-slate-600 truncate">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedTask.submission.projectUrl}</span>
                  </div>
                )}
                {selectedTask.feedback && (
                  <div className="text-purple-900 font-medium pt-1 border-t border-slate-200">
                    ★ Mentor Rating: {selectedTask.feedback.rating}/5 from {selectedTask.feedback.mentorName}
                  </div>
                )}
              </div>
            )}

            {(selectedTaskId === 'custom' || tasks.length === 0) && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Distributed Cache in Rust"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Skills Practiced (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={customSkills}
                    onChange={(e) => setCustomSkills(e.target.value)}
                    placeholder="Rust, Concurrency, Redis, TCP Sockets"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Project Repository / Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={customProjectUrl}
                    onChange={(e) => setCustomProjectUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Lessons Learned & Technical Notes
                  </label>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="What did you build, what hurdles did you debug, and what architectural lessons did you learn?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => generatePost()}
              disabled={generating}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Drafting Post...' : 'Re-Draft Post with AI'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Linkedin className="w-4 h-4 text-indigo-700" />
              Why share practical projects?
            </p>
            <p className="leading-relaxed text-indigo-800">
              Technical recruiters search LinkedIn for students who demonstrate genuine problem-solving, skills practiced, and lessons learned. Documenting real project evidence builds public credibility.
            </p>
          </div>
        </div>

        {/* Right Column: LinkedIn Post Mockup & Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-none">{user?.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Student • Demonstrating Evidence on Road to Career
                  </p>
                  <p className="text-[10px] text-slate-400">Just now • 🌐 Public</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Review & Edit Post Draft (Including Skills Practiced & Lessons Learned)
              </label>
              <textarea
                rows={13}
                value={draftPost}
                onChange={(e) => setDraftPost(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/50"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-slate-500 text-xs font-medium">
              <span className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-default">
                <ThumbsUp className="w-4 h-4" /> Like
              </span>
              <span className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-default">
                <MessageCircle className="w-4 h-4" /> Comment
              </span>
              <span className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-default">
                <Repeat2 className="w-4 h-4" /> Repost
              </span>
              <span className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-default">
                <Send className="w-4 h-4" /> Send
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {copied ? '✓ Post text copied to your clipboard!' : 'Feel free to tweak the post before publishing.'}
            </span>
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Open LinkedIn Feed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading AI Post Drafter...</div>}>
      <LinkedInGeneratorContent />
    </Suspense>
  );
}