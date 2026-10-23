'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Star,
  ExternalLink,
  ShieldCheck,
  Shield,
  ArrowRight,
  Share2,
  Printer,
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  Eye,
  X,
  MessageSquare,
  Image as ImageIcon,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import { CareerReadinessReport } from '@/lib/types';

export default function ReadinessReportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [report, setReport] = useState<CareerReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingShare, setUpdatingShare] = useState(false);
  const [shareStatusMessage, setShareStatusMessage] = useState('');
  const [showRecruiterPreview, setShowRecruiterPreview] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadReport();
    }
  }, [user, authLoading, router]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report');
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (e) {
      console.error('Error fetching report', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async () => {
    if (!report) return;
    const newStatus = !report.shareWithRecruiters;
    setUpdatingShare(true);
    try {
      const res = await fetch('/api/report', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareWithRecruiters: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setReport((prev) => (prev ? { ...prev, shareWithRecruiters: newStatus } : null));
        setShareStatusMessage(data.message || 'Recruiter visibility updated successfully!');
        setTimeout(() => setShareStatusMessage(''), 4000);
      }
    } catch (e) {
      console.error('Error updating sharing status', e);
    } finally {
      setUpdatingShare(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Computing your career-readiness audit...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500">Could not generate readiness report.</p>
        <Link href="/dashboard" className="text-indigo-600 font-bold text-xs underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Report Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Verified Career-Readiness Audit
            </span>
            <span className="text-xs text-slate-400">
              Updated {new Date(report.lastUpdated).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {report.studentName}'s Career Readiness Report
          </h1>
          <p className="text-sm text-slate-600">
            Target Track: <strong className="text-slate-900">{report.targetCareer}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowRecruiterPreview(true)}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            title="Preview how recruiters see your profile"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Preview Recruiter View</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>

          <Link
            href="/portfolio"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" /> View Portfolio
          </Link>
        </div>
      </div>

      {/* Recruiter Sharing Preference Bar */}
      <div
        className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm ${
          report.shareWithRecruiters
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
              report.shareWithRecruiters
                ? 'bg-emerald-200/80 text-emerald-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {report.shareWithRecruiters ? (
              <Unlock className="w-6 h-6 text-emerald-700" />
            ) : (
              <Lock className="w-6 h-6 text-slate-600" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold">
                {report.shareWithRecruiters
                  ? 'Shared with Vetted Tech Recruiters'
                  : 'Report Is Currently Private'}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  report.shareWithRecruiters
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {report.shareWithRecruiters ? 'Active' : 'Private'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              {report.shareWithRecruiters
                ? 'Your verified project deliverables, demonstrated skills, and mentor feedback are discoverable by verified employers in the Recruiter Talent Pool.'
                : 'Only you can view this readiness report. Employers cannot view your profile until you explicitly choose to share.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleToggleShare}
            disabled={updatingShare}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              report.shareWithRecruiters
                ? 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-rose-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            {updatingShare
              ? 'Updating...'
              : report.shareWithRecruiters
              ? 'Revoke & Make Private'
              : 'Share Report with Recruiters'}
          </button>
        </div>
      </div>

      {shareStatusMessage && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{shareStatusMessage}</span>
        </div>
      )}

      {/* Main Readiness Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Gauge Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Readiness Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-slate-900">{report.readinessScore}%</span>
              <span className="text-xs font-bold text-emerald-600">Calculated</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${report.readinessScore}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Composite evaluation based on foundation, completed roadmap deliverables, code quality, and verified mentor reviews.
          </p>
        </div>

        {/* Practical Projects Completed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Deliverables
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-indigo-600">{report.totalTasksCompleted}</span>
              <span className="text-xs text-slate-500">Completed tasks</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Tangible practical projects backed by code repository links, screenshots, and implementation notes.
          </p>

          <Link
            href="/portfolio"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Browse Full Evidence Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skills Demonstrated */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Demonstrated Tech Skills
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-purple-600">{report.skillsDemonstrated.length}</span>
              <span className="text-xs text-slate-500">Verified competencies</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {report.skillsDemonstrated.slice(0, 4).map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                {s}
              </span>
            ))}
            {report.skillsDemonstrated.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{report.skillsDemonstrated.length - 4} more
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Validated through functional tasks and project submissions rather than self-reported claims.
          </p>
        </div>
      </div>

      {/* Completed Projects with Saved Evidence */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>Completed Projects & Saved Deliverables ({report.completedProjects.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified code repositories, screenshot proofs, and technical reflections saved for this career path.
            </p>
          </div>

          <Link
            href="/tasks"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Add More Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {report.completedProjects.length > 0 ? (
          <div className="space-y-4">
            {report.completedProjects.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                      </span>
                      <span className="text-xs text-slate-400">
                        {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : 'Active deliverable'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    {p.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    )}

                    {/* Reflection / Lessons learned */}
                    {p.notes && (
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900 block mb-0.5">
                          Lessons Learned & Reflections:
                        </span>
                        <p className="italic text-slate-600 leading-relaxed">"{p.notes}"</p>
                      </div>
                    )}

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-150"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links, Screenshot thumbnail & Actions */}
                  <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                    {p.screenshotUrl && (
                      <div className="w-36 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                        <img
                          src={p.screenshotUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {p.projectUrl && (
                        <a
                          href={p.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>Code Link</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}

                      <button
                        onClick={() => router.push(`/linkedin-generator?taskId=${p.taskId}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                        title="Draft LinkedIn post from this completed project"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Draft Post</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mentor review if attached */}
                {p.mentorRating && (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950">
                        Actual Mentor Review by {p.mentorName || 'Industry Mentor'}
                      </span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < p.mentorRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {p.mentorComment && (
                      <p className="text-purple-900 italic">"{p.mentorComment}"</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
            <p className="font-medium text-slate-700">No completed project deliverables recorded yet.</p>
            <p className="text-slate-400">
              Work through your personalized roadmap and submit code repository evidence on the Task Tracker!
            </p>
          </div>
        )}
      </div>

      {/* Actual Mentor Feedback Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Actual Mentor Feedback & Reviews ({report.mentorReviews?.length || 0})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Genuine evaluations written by experienced mentors reviewing your code deliverables.
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            Zero Fake Reviews Policy
          </div>
        </div>

        {report.mentorReviews && report.mentorReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.mentorReviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rev.mentorName}</span>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    Reviewed Task: <span className="text-indigo-700 font-bold">{rev.taskTitle}</span>
                  </p>

                  <p className="text-xs text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-amber-100">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Reviewed on {new Date(rev.reviewedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>No mentor reviews recorded yet</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              When a mentor reviews your submitted code in the Mentor Dashboard, their verified feedback and ratings will appear here. Road to Career adheres to strict data integrity: <strong>no synthetic or fake mentor evaluations are ever created.</strong>
            </p>
          </div>
        )}
      </div>

      {/* Strengths & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Strengths */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Strengths</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {report.strengths.map((st, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-600">✓</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Next Steps */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Suggested Next Steps to Elevate Readiness</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {report.suggestedNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-bold text-indigo-600">→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recruiter View Modal Preview */}
      {showRecruiterPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Recruiter Preview Mode
                </h3>
              </div>
              <button
                onClick={() => setShowRecruiterPreview(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              This is a live preview of how your candidate profile and project evidence card appears to employers in the <strong>Tech Talent Pool</strong>.
            </div>

            {/* Simulated Candidate Card */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{report.studentName}</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{report.targetCareer}</p>
                  <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Readiness: {report.readinessScore}%
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 block mb-1">
                  Verified Skills Demonstrated ({report.skillsDemonstrated.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.skillsDemonstrated.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-600 block mb-1">
                  Completed Projects & Evidence ({report.completedProjects.length}):
                </span>
                <div className="space-y-2">
                  {report.completedProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{p.title}</span>
                        {p.mentorRating && (
                          <span className="ml-2 text-amber-600 font-bold">
                            ★ {p.mentorRating}/5 (Mentor Approved)
                          </span>
                        )}
                      </div>
                      {p.projectUrl ? (
                        <span className="text-indigo-600 font-medium truncate max-w-[200px]">
                          {p.projectUrl}
                        </span>
                      ) : (
                        <span className="text-slate-400">Milestone completed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Sharing Status:{' '}
                <strong>
                  {report.shareWithRecruiters ? 'Currently Shared' : 'Currently Private'}
                </strong>
              </span>
              <button
                onClick={() => setShowRecruiterPreview(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}