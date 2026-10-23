'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Compass,
  Sparkles,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Award,
  Code2,
  Briefcase,
  Check,
} from 'lucide-react';
import { CareerRecommendation } from '@/lib/types';

export default function RecommendationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingRoadmapFor, setGeneratingRoadmapFor] = useState<string | null>(null);
  const [engineLabel, setEngineLabel] = useState<string>('');
  const [isRealAi, setIsRealAi] = useState<boolean>(false);
  const [hasAssessment, setHasAssessment] = useState<boolean>(false);
  const [dominantTraits, setDominantTraits] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchRecommendations();
    }
  }, [user, authLoading, router]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommendations');
      const data = await res.json();

      const hasFullDetails =
        data.recommendations &&
        data.recommendations.length > 0 &&
        Array.isArray(data.recommendations[0].beginnerCourses) &&
        Array.isArray(data.recommendations[0].practicalProjects) &&
        Array.isArray(data.recommendations[0].reasons);

      if (res.ok && hasFullDetails) {
        setRecommendations(data.recommendations);
        setHasAssessment(Boolean(data.hasAssessment));
        setDominantTraits(data.dominantTraits || []);
        setLoading(false);
      } else {
        await handleGenerateNew();
      }
    } catch (e: any) {
      setError(e.message || 'Error loading recommendations');
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommendations', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate recommendations');
      }
      setRecommendations(data.recommendations || []);
      setEngineLabel(data.label || '');
      setIsRealAi(Boolean(data.isRealAi));
      setHasAssessment(Boolean(data.hasAssessment));
      setDominantTraits(data.dominantTraits || []);
    } catch (e: any) {
      setError(e.message || 'Error generating recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseCareer = async (careerTitle: string) => {
    setGeneratingRoadmapFor(careerTitle);
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerTitle }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate roadmap');
      }

      router.push('/roadmap');
    } catch (e: any) {
      alert(e.message || 'Error creating roadmap');
    } finally {
      setGeneratingRoadmapFor(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">
          Synthesizing your skills, hobbies, and assessment traits to suggest tailored career paths...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Recommended Career Pathways</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {engineLabel || (hasAssessment ? 'Refined by Assessment & Profile' : 'Profile-Based Matching')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Carefully ranked paths matching your qualifications, technical strengths, and future ambitions.
          </p>
        </div>

        <button
          onClick={handleGenerateNew}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-Analyze Matches
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold shrink-0"
          >
            Update Profile
          </button>
        </div>
      )}

      {/* MCQ Assessment Refinement Callout */}
      {!hasAssessment ? (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need More Guidance?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Refine Your Career Matches with the Aptitude Assessment
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Not sure which path fits you best? Take our 8-scenario multiple-choice assessment to uncover your natural problem-solving instincts, analytical style, and cognitive traits to refine these recommendations.
            </p>
          </div>

          <Link
            href="/assessment"
            className="px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Take Assessment to Refine Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-950">
                  Recommendations Refined by Your Assessment
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
                  Active
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Primary cognitive traits: <strong>{dominantTraits.join(' & ')}</strong>. Scores and reasons are saved directly to your account.
              </p>
            </div>
          </div>

          <Link
            href="/assessment"
            className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment to Re-Refine</span>
          </Link>
        </div>
      )}

      {/* 3 Career Recommendation Cards */}
      <div className="space-y-8">
        {recommendations.slice(0, 3).map((career, idx) => (
          <div
            key={career.id || idx}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 space-y-6"
          >
            {/* Top Bar: Domain, Title, Match Score */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    {career.domain}
                  </span>
                  <span className="text-xs text-slate-400">Match Rank #{idx + 1}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{career.title}</h2>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-600 text-white self-start sm:self-auto shadow-sm">
                <span className="text-xl font-black">{career.matchScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 leading-tight">
                  Compatibility <br /> Match
                </span>
              </div>
            </div>

            {/* Explanation Summary */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {career.explanation}
            </p>

            {/* 1. REASONS WHY THIS CAREER SUITS YOU */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Why This Path Matches You (Profile & Aptitude Alignment)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {career.reasons && career.reasons.length > 0 ? (
                  career.reasons.map((reason, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2.5">
                      <span className="font-bold text-indigo-600 shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2 text-slate-600">
                    <span>Directly intersects with your academic study and practical technical goals.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* 2. REQUIRED SKILLS */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Essential Required Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.requiredSkills.map((sk, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-150"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. BEGINNER COURSES & PRACTICAL PROJECTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Beginner Courses */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Recommended Beginner Courses</span>
                </h4>

                <div className="space-y-2.5">
                  {career.beginnerCourses && career.beginnerCourses.length > 0 ? (
                    career.beginnerCourses.map((course, cIdx) => (
                      <a
                        key={cIdx}
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/20 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {course.title}
                          </h5>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 shrink-0" />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>{course.provider}</span>
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            course.free ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {course.free ? 'Free / Audit' : 'Paid / Certificate'}
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Curated beginner courses available in roadmap.</p>
                  )}
                </div>
              </div>

              {/* Practical Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Practical Projects to Build (Evidence Deliverables)</span>
                </h4>

                <div className="space-y-2.5">
                  {career.practicalProjects && career.practicalProjects.length > 0 ? (
                    career.practicalProjects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5"
                      >
                        <h5 className="text-xs font-bold text-slate-900">{proj.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {proj.description}
                        </p>
                        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-150 text-[11px] text-emerald-950">
                          <strong>Deliverable:</strong> {proj.deliverable}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Practical project briefs generated in roadmap.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Compensation & Outlook */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Typical Salary Range</p>
                  <p className="text-xs font-bold text-slate-900">{career.salaryRange}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Industry Growth Outlook</p>
                  <p className="text-xs font-bold text-slate-900">{career.growthOutlook}</p>
                </div>
              </div>
            </div>

            {/* Alternative Career Options */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Alternative Career Options:</span>
              {career.alternativeOptions.map((alt, aIdx) => (
                <span
                  key={aIdx}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {alt}
                </span>
              ))}
            </div>

            {/* Card Action Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Typical Entry Roles: {career.typicalRoles.join(', ')}
              </span>

              <button
                onClick={() => handleChooseCareer(career.title)}
                disabled={generatingRoadmapFor === career.title}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {generatingRoadmapFor === career.title
                    ? 'Activating Curriculum...'
                    : 'Activate Learning Roadmap'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
