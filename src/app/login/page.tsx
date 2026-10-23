'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Compass,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Award,
  Star,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Visual Interactive State on right side
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);

  const previewTracks = [
    {
      title: 'Cloud DevOps & SRE',
      domain: 'Cloud Architecture',
      matchScore: 94,
      readiness: 88,
      milestone: 'Kubernetes Microservice Deployment',
      deliverable: 'github.com/project/k8s-mesh',
      skills: ['Docker', 'Kubernetes', 'Go', 'Terraform', 'CI/CD'],
      mentorReview: 'Exceptional helm chart configuration with robust zero-downtime health probes.',
      mentorName: 'Senior DevOps Lead',
      rating: 5,
    },
    {
      title: 'Full-Stack AI Engineer',
      domain: 'AI & Web Systems',
      matchScore: 96,
      readiness: 92,
      milestone: 'RAG Pipeline with Vector Search',
      deliverable: 'github.com/project/rag-search',
      skills: ['Next.js', 'Python', 'FastAPI', 'pgvector', 'TypeScript'],
      mentorReview: 'Clean semantic search implementation with sub-100ms vector index latency.',
      mentorName: 'Principal AI Engineer',
      rating: 5,
    },
    {
      title: 'Cybersecurity Analyst',
      domain: 'Information Security',
      matchScore: 91,
      readiness: 85,
      milestone: 'Automated Vulnerability Scanner',
      deliverable: 'github.com/project/sec-audit',
      skills: ['Linux', 'Python', 'Network Security', 'OWASP', 'Wireshark'],
      mentorReview: 'Thorough penetration testing report covering top 10 OWASP vector mitigations.',
      mentorName: 'Security Director',
      rating: 5,
    },
  ];

  const currentPreview = previewTracks[activeTrackIdx];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      login(data.token, data.user);
      await refreshAuth();

      // Redirect based on role
      if (data.user.role === 'mentor') {
        router.push('/mentor');
      } else if (data.user.role === 'recruiter') {
        router.push('/recruiter');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        
        {/* LEFT COLUMN: Clean, Private Authentication Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Header & Logo */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Evidence-Based Career Acceleration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                Sign in to <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Road to Career</span>
              </h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Access your personalized learning roadmap, verified project evidence, and industry mentor evaluations.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <span className="text-sm">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <span className="text-xs text-slate-400">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white shadow-2xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? 'Authenticating Credentials...' : 'Sign In to Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Bottom Link */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Don't have an account yet?</span>
            <Link
              href="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 flex items-center gap-1"
            >
              <span>Create Account</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Rich Live Visual Showcase Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Animated Background Mesh Blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

          {/* Top Live Telemetry Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>● Live Career Telemetry Engine</span>
              </div>
              <span className="text-[11px] text-indigo-200/60 font-mono">v2.4 Live Sync</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Verifiable Project Evidence in Real-Time
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                Road to Career verifies genuine code repositories, screenshot deliverables, and mentor ratings.
              </p>
            </div>

            {/* Interactive Pathway Selector Tabs */}
            <div className="flex flex-wrap gap-2 pt-1">
              {previewTracks.map((track, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTrackIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTrackIdx === idx
                      ? 'bg-white text-indigo-950 shadow-md scale-102'
                      : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>

          {/* Central Live Interactive Showcase Card */}
          <div className="relative z-10 my-6 p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl space-y-4">
            {/* Career Match & Readiness Gauges */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {currentPreview.domain}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 font-heading">{currentPreview.title}</h3>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] text-indigo-200 block uppercase font-bold">Compatibility</span>
                  <span className="text-lg font-black text-emerald-400">{currentPreview.matchScore}%</span>
                </div>
                <div className="h-7 w-[1px] bg-white/15"></div>
                <div>
                  <span className="text-[10px] text-indigo-200 block uppercase font-bold">Readiness</span>
                  <span className="text-lg font-black text-cyan-400">{currentPreview.readiness}%</span>
                </div>
              </div>
            </div>

            {/* Live Milestone Deliverable Node */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Deliverable:</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Code Verified
                </span>
              </div>
              <p className="text-xs font-bold text-white">{currentPreview.milestone}</p>
              <p className="text-[11px] text-indigo-300 font-mono truncate">{currentPreview.deliverable}</p>
            </div>

            {/* Verified Skills Cloud */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1.5">
                Demonstrated Tech Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPreview.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-semibold border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actual Mentor Feedback Snippet */}
            <div className="p-3 rounded-xl bg-violet-900/30 border border-violet-500/30 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-200">{currentPreview.mentorName}</span>
                <div className="flex items-center text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-300 text-amber-300" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-violet-100 italic leading-relaxed">
                "{currentPreview.mentorReview}"
              </p>
            </div>
          </div>

          {/* Bottom Live Activity Stats Strip */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-base font-extrabold text-white block font-heading">1,280+</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">Verified Proofs</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-base font-extrabold text-emerald-400 block font-heading">35+</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">Active Mentors</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-base font-extrabold text-cyan-400 block font-heading">100%</span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">Authentic Code</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
