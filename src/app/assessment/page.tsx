'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Question } from '@/lib/assessment-data';
import { AssessmentResult } from '@/lib/types';

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromProfile, setFromProfile] = useState(false);
  const [domainLabel, setDomainLabel] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'profile') {
        setFromProfile(true);
      }
    }
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assessment');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        if (data.domainLabel) {
          setDomainLabel(data.domainLabel);
        }
        if (data.savedResult) {
          setResult(data.savedResult);
          if (data.savedResult.recommendedTracks && data.trackDetails) {
            setTopTracks(
              data.savedResult.recommendedTracks
                .map((k: string) => data.trackDetails[k])
                .filter(Boolean)
            );
          }
        }
      }
    } catch (e) {
      console.error('Error fetching questions', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
        setTopTracks(data.topTracks || []);
      }
    } catch (e) {
      console.error('Failed to submit assessment', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentIdx(0);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium mt-3">Loading career interest assessment...</p>
      </div>
    );
  }

  // If user is not authenticated, show sign-in gate
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Sign In to Take Your Assessment</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Career assessments are dynamically tailored to your student qualification, interests, and ambitions. Please sign in or create an account to begin.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.push('/login?redirect=/profile')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            Create Free Account
          </button>
        </div>
      </div>
    );
  }

  // If result is already completed and user hasn't clicked retake
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {fromProfile && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Profile Updated!</strong> Review your previous assessment below, or retake the quiz to align with your newly saved profile.
              </span>
            </div>
            <button
              onClick={handleRetake}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 self-start sm:self-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake Quiz Now</span>
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Assessment Completed
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Career Trait Analysis</h1>
              <p className="text-sm text-slate-500 mt-1">
                Completed on {new Date(result.completedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
              <button
                onClick={() => router.push('/recommendations')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-250 flex items-center gap-1.5 transition-all"
              >
                <span>View Full Career Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dominant Traits */}
          <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">Primary Natural Aptitude</h3>
            <div className="flex flex-wrap gap-2.5">
              {result.dominantTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-sm border border-indigo-200 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-indigo-600" />
                  {trait}
                </span>
              ))}
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed pt-1">
              Your responses demonstrate high affinity for problem solving, structured logic, and evidence-driven development.
            </p>
          </div>

          {/* Track Scores Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">Category Score Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(result.scores).map(([category, score]) => {
                const label = category.replace(/_/g, ' ').toUpperCase();
                const max = 24;
                const pct = Math.min(Math.round((score / max) * 100), 100);

                return (
                  <div key={category} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{label}</span>
                      <span className="font-bold text-indigo-600">{score} pts ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refined Recommended Tracks Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Refined Career Recommendations Based on Your Answers</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Saved to Your Account
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTracks.map((track, tIdx) => (
                <div
                  key={tIdx}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                      Rank #{tIdx + 1} • {track.domain}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{track.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{track.summary}</p>
                    <div className="pt-1 flex flex-wrap gap-1">
                      {track.keySkills.slice(0, 3).map((sk: string, sIdx: number) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{track.beginnerCourses?.length || 3} Beginner Courses</span>
                    <span className="font-semibold text-indigo-600">{track.practicalProjects?.length || 2} Projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              ✓ All traits and refined career recommendations have been saved to your student profile.
            </span>
            <button
              onClick={() => router.push('/recommendations')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-250 flex items-center gap-2"
            >
              <span>View Full Career Paths, Courses & Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Questionnaire
  const currentQuestion = questions[currentIdx];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / total) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {fromProfile && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Profile Information Saved!</strong> Answer these 8 quick situational questions to refine and personalize your career recommendations.
          </span>
        </div>
      )}

      {/* Quiz Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 text-indigo-600 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 shrink-0" />
            <span>{domainLabel || 'Career Aptitude Assessment'}</span>
          </span>
          <span>Question {currentIdx + 1} of {total} ({progressPct}% completed)</span>
        </div>

        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentQuestion && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Scenario #{currentIdx + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQuestion.prompt}
            </h2>
            <p className="text-xs text-slate-500">{currentQuestion.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestion.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border text-xs font-bold ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className={`text-sm leading-relaxed ${isSelected ? 'text-indigo-950 font-semibold' : 'text-slate-700'}`}>
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600"
            >
              ← Previous
            </button>

            {currentIdx < total - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-250 disabled:opacity-40 flex items-center gap-1.5 transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount < total || submitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-250 disabled:opacity-40 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Analyzing Responses...' : 'Complete & See Trait Analysis'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
