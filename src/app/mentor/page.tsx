'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  MessageSquare,
  Clock,
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  RotateCcw,
} from 'lucide-react';
import { TaskItem } from '@/lib/types';

interface ExtendedSubmission extends TaskItem {
  studentName?: string;
  studentEmail?: string;
}

export default function MentorDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [submissions, setSubmissions] = useState<ExtendedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ExtendedSubmission | null>(null);

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'revision_requested'>('approved');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'mentor') {
      loadSubmissions();
    } else {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentor/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        if (data.submissions && data.submissions.length > 0 && !selectedSubmission) {
          setSelectedSubmission(data.submissions[0]);
        }
      }
    } catch (e) {
      console.error('Error loading submissions', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setReviewMessage('');
    setReviewError('');
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/tasks/${selectedSubmission.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          status: reviewStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewMessage(data.message || 'Feedback recorded successfully!');
      setComment('');
      await loadSubmissions();

      // Clear selection or advance to next
      setTimeout(() => {
        setReviewMessage('');
      }, 3000);
    } catch (err: any) {
      setReviewError(err.message || 'Error recording review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Loading mentor review dashboard...</p>
      </div>
    );
  }

  // Access Control Guard
  if (user && user.role !== 'mentor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Mentor Portal Access Restricted</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You are currently signed in as a <strong>{user.role}</strong> ({user.email}). Only verified mentor accounts can review project deliverables and issue ratings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Sign in with a Mentor Account
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Return to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');
  const alreadyReviewedSubmissions = submissions.filter((s) => s.status === 'completed' || s.feedback);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Mentor Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Mentor Review Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Project Review Portal
          </h1>
          <p className="text-sm text-slate-500">
            Welcome, {user?.name}. Examine student project repositories, test live links, and provide constructive ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
            {pendingSubmissions.length} Pending Review
          </div>
          <button
            onClick={loadSubmissions}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Review Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Submissions List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Submissions Queue ({submissions.length})
          </h3>

          <div className="space-y-3">
            {submissions.length > 0 ? (
              submissions.map((sub) => {
                const isSelected = selectedSubmission?.id === sub.id;
                const isPending = sub.status === 'submitted';

                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setComment(sub.feedback?.comment || '');
                      setRating(sub.feedback?.rating || 5);
                      setReviewStatus(sub.feedback?.status || 'approved');
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900">{sub.studentName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isPending ? 'Pending Review' : 'Reviewed ✓'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{sub.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {sub.submission?.notes || sub.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {sub.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No student submissions found. Submissions uploaded by students will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Active Submission Inspection & Review Form */}
        <div className="lg:col-span-7">
          {selectedSubmission ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Submission Details Header */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Student Candidate: <strong className="text-slate-900">{selectedSubmission.studentName}</strong></span>
                  <span>Submitted: {selectedSubmission.submission ? new Date(selectedSubmission.submission.submittedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedSubmission.title}</h2>
              </div>

              {/* Submission Evidence Links */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Delivered Project Evidence
                </h4>

                <div className="space-y-2 text-xs">
                  {selectedSubmission.submission?.projectUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-2 truncate">
                        <LinkIcon className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{selectedSubmission.submission.projectUrl}</span>
                      </div>
                      <a
                        href={selectedSubmission.submission.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Open Repo / Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No external URL provided.</p>
                  )}

                  {selectedSubmission.submission?.screenshotUrl && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                          Screenshot Verification
                        </span>
                        <a
                          href={selectedSubmission.submission.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-purple-600 hover:underline flex items-center gap-0.5"
                        >
                          Full Image <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <img
                        src={selectedSubmission.submission.screenshotUrl}
                        alt="Project proof screenshot"
                        className="w-full max-h-56 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {selectedSubmission.submission?.notes && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700">
                      <p className="font-semibold text-slate-900 mb-1">Student's Engineering Notes:</p>
                      <p className="italic leading-relaxed">{selectedSubmission.submission.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Feedback Form */}
              <form onSubmit={handleSubmitReview} className="space-y-5 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Mentor Review & Score</span>
                </h3>

                {reviewMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{reviewMessage}</span>
                  </div>
                )}
                {reviewError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                    {reviewError}
                  </div>
                )}

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Action Status Radio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Evaluation Decision *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewStatus('approved')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        reviewStatus === 'approved'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Approve & Verify Project
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewStatus('revision_requested')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        reviewStatus === 'revision_requested'
                          ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      Request Revision
                    </button>
                  </div>
                </div>

                {/* Qualitative Feedback */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Constructive Feedback & Recommendations *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide specific, actionable feedback on their code quality, repository structure, tests, and documentation."
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-250 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{submittingReview ? 'Recording Review...' : 'Submit Mentor Review'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Select a submission from the queue on the left to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
