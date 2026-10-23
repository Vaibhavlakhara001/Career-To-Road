'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Briefcase,
  Search,
  Award,
  ExternalLink,
  ShieldCheck,
  Star,
  User,
  Filter,
  CheckCircle2,
  X,
  Link as LinkIcon,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Candidate {
  studentId: string;
  name: string;
  email: string;
  profile: any;
  targetCareer: string;
  totalCompletedTasks: number;
  totalTasks: number;
  verifiedSkills: string[];
  completedProjects: {
    taskId: string;
    title: string;
    projectUrl: string;
    screenshotUrl?: string;
    notes?: string;
    mentorRating?: number;
    mentorComment?: string;
    mentorName?: string;
    skills: string[];
    completedAt: string;
  }[];
  assessmentTraits: string[];
}

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && (user.role === 'recruiter' || user.role === 'mentor')) {
      loadCandidates();
    } else {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (skillFilter) query.set('skill', skillFilter);
      if (roleFilter) query.set('role', roleFilter);

      const res = await fetch(`/api/recruiter/candidates?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (e) {
      console.error('Error fetching shared candidates', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates();
  };

  const handleResetFilters = () => {
    setSkillFilter('');
    setRoleFilter('');
    setTimeout(() => {
      fetch('/api/recruiter/candidates')
        .then((r) => r.json())
        .then((d) => setCandidates(d.candidates || []));
    }, 50);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Scanning verified talent reports...</p>
      </div>
    );
  }

  // Access Control Guard
  if (user && user.role !== 'recruiter' && user.role !== 'mentor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Recruiter Portal Access Restricted</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You are signed in with a <strong>{user.role}</strong> account. The talent directory allows verified employers and recruiters to inspect students who explicitly opted in to share their readiness reports.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Sign in with a Recruiter Account
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Recruiter Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Candidate Talent Pool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tech Talent & Project Evidence Directory
          </h1>
          <p className="text-sm text-slate-500">
            Review candidates who have completed hands-on projects, verified code submissions, and earned mentor ratings.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shrink-0 self-start md:self-auto">
          {candidates.length} Candidate Reports Available
        </div>
      </div>

      {/* Filter / Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Search by verified skill (e.g. React, Python, Docker)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative sm:w-64">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            placeholder="Filter by target role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>

        {(skillFilter || roleFilter) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors"
          >
            Reset
          </button>
        )}
      </form>

      {/* Candidates Cards Grid */}
      <div className="space-y-6">
        {candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c) => (
              <div
                key={c.studentId}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Candidate Identity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">{c.name}</h3>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{c.targetCareer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Qualification */}
                  {c.profile?.qualification && (
                    <p className="text-xs text-slate-600 line-clamp-1">
                      🎓 {c.profile.qualification}
                    </p>
                  )}

                  {/* Evidence Deliverables Count */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Completed Projects</span>
                    <span className="font-bold text-emerald-700">{c.totalCompletedTasks} with code links</span>
                  </div>

                  {/* Verified Skills */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Verified Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {c.verifiedSkills.slice(0, 4).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-150"
                        >
                          {sk}
                        </span>
                      ))}
                      {c.verifiedSkills.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{c.verifiedSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {c.profile?.linkedInUrl ? (
                    <a
                      href={c.profile.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Profile Opted-In</span>
                  )}

                  <button
                    onClick={() => setSelectedCandidate(c)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    View Project Evidence
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Students appear in this directory once they opt-in by selecting "Share Report with Recruiters" in their profile or readiness report settings.
            </p>
          </div>
        )}
      </div>

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-xs text-emerald-700 font-semibold">{selectedCandidate.targetCareer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p><strong>Qualification:</strong> {selectedCandidate.profile?.qualification || 'Undergraduate'}</p>
                <p><strong>Preferred Language:</strong> {selectedCandidate.profile?.preferredLanguage || 'English'}</p>
                <p><strong>Ambitions:</strong> {selectedCandidate.profile?.ambitions || 'Industry Career'}</p>
                {selectedCandidate.profile?.linkedInUrl && (
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a
                      href={selectedCandidate.profile.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {selectedCandidate.profile.linkedInUrl}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Completed Projects with Verifiable URLs & Mentor Ratings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Verified Practical Projects ({selectedCandidate.completedProjects.length})</span>
              </h4>

              {selectedCandidate.completedProjects.length > 0 ? (
                <div className="space-y-3">
                  {selectedCandidate.completedProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900">{p.title}</h5>
                        {p.projectUrl ? (
                          <a
                            href={p.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Inspect Code Repo / Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Verified Milestone</span>
                        )}
                      </div>

                      {p.screenshotUrl && (
                        <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
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

                      {p.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                          "{p.notes}"
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {p.mentorRating && (
                        <div className="p-2.5 rounded-lg bg-purple-50 text-[11px] text-purple-900 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              Verified Mentor Review {p.mentorName ? `by ${p.mentorName}` : ''}:
                            </span>
                            <div className="flex items-center text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < p.mentorRating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {p.mentorComment && <p className="italic">"{p.mentorComment}"</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No project submissions yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Close Candidate Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
