'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Briefcase,
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
  Share2,
  ChevronRight,
  Code2,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Evidence-Based Student Career Acceleration Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Stop guessing your future. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Build verifiable proof
            </span> of what you can do.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Road to Career guides college students from career uncertainty to industry readiness. Discover high-growth tech roles, follow structured learning roadmaps, build real-world projects, receive mentor feedback, and showcase verified evidence to recruiters.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-250 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started as Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In to Existing Account
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Personalized Roadmaps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verifiable Project Evidence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real Mentor Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Recruiter-Ready Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">The Real Challenge</h2>
          <p className="text-3xl font-bold text-slate-900">Why Traditional College-to-Career Advice Fails</p>
          <p className="text-slate-600 mt-2">
            The gap between generic classroom curricula and actual entry-level industry demands is wider than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem Card */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-8 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl mb-6">
              ✕
            </div>
            <h3 className="text-xl font-bold text-rose-900 mb-4">The Student Trap Today</h3>
            <ul className="space-y-4 text-sm text-rose-800">
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-500 mt-0.5">•</span>
                <span><strong>Tutorial Hell:</strong> Watching hours of courses without building standalone projects that solve real problems.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-500 mt-0.5">•</span>
                <span><strong>Resume Keyword Stuffing:</strong> Listing 20 skills on a resume with zero verifiable deliverables or code evidence.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-500 mt-0.5">•</span>
                <span><strong>Zero Meaningful Feedback:</strong> Applying blindly into recruiter black holes without mentors to review code quality.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-rose-500 mt-0.5">•</span>
                <span><strong>Overwhelmed by Options:</strong> Confused about whether to pursue AI, Web Dev, Cloud, DevOps, or Design.</span>
              </li>
            </ul>
          </div>

          {/* The Road to Career Solution Card */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-8 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl mb-6">
              ✓
            </div>
            <h3 className="text-xl font-bold text-indigo-950 mb-4">The Road to Career Approach</h3>
            <ul className="space-y-4 text-sm text-indigo-900">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Tailored Career Discovery:</strong> Multi-trait interest quiz & skill profiler that maps exact high-demand roles.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Milestone-Driven Roadmaps:</strong> Curated free & industry-standard resources paired with practical coding tasks.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Verifiable Project Evidence:</strong> Submit live URLs, repositories, and screenshots directly into your verified portfolio.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Live Mentors & Recruiter Showcase:</strong> Receive real mentor ratings and share evidence directly with hiring managers.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5-Step Progression Flow */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Step-by-Step System</h2>
            <p className="text-3xl font-bold text-slate-900">How You Go From Student to Hired</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Create Profile & Quiz</h4>
              <p className="text-xs text-slate-500">Capture your interests, hobbies, qualification, and assess problem-solving traits.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 mb-1">AI Career Match</h4>
              <p className="text-xs text-slate-500">Receive matched career paths with salary ranges, required skills, and alternative options.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Follow Roadmap</h4>
              <p className="text-xs text-slate-500">Complete 4 curated milestones combining top resources and practical project tasks.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Submit & Get Feedback</h4>
              <p className="text-xs text-slate-500">Submit repo URLs and demo screenshots. Receive constructive feedback from mentors.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                5
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Recruiter Report</h4>
              <p className="text-xs text-slate-500">Publish your verified readiness report to recruiters and generate viral LinkedIn posts with AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Designed For The Entire Ecosystem</h2>
          <p className="text-3xl font-bold text-slate-900">Tailored Dashboards for Every User</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Hub */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-sm text-slate-600 mb-6">
              Discover your optimal tech path, complete practical tasks, track deadlines, build an evidence portfolio, and draft AI LinkedIn posts.
            </p>
            <Link
              href="/signup?role=student"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign Up as Student <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mentor Hub */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">For Mentors</h3>
            <p className="text-sm text-slate-600 mb-6">
              Review student project submissions, inspect GitHub repositories and UI screenshots, provide 1-5 star ratings, and leave actionable feedback.
            </p>
            <Link
              href="/signup?role=mentor"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              Join as Mentor <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Recruiter Hub */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">For Recruiters</h3>
            <p className="text-sm text-slate-600 mb-6">
              Search vetted candidates who opted in to share their career-readiness reports. Filter by verified skills, reviewed projects, and readiness scores.
            </p>
            <Link
              href="/signup?role=recruiter"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Recruiter Access <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Ready To Start?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-4">
              Accelerate Your Tech Journey With Verifiable Evidence
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed mb-6">
              Create your account, complete your profile, and start building verified practical deliverables that set you apart in tech hiring.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 bg-white text-indigo-900 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-md"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl border border-indigo-500/50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
