'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  Compass,
  User as UserIcon,
  CheckSquare,
  Briefcase,
  Share2,
  FileText,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiInfoOpen, setAiInfoOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-150 transition-transform group-hover:scale-105">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                    Road to Career
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {!user && (
                <>
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Home
                  </Link>
                </>
              )}

              {user?.role === 'student' && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/profile') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/assessment"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/assessment') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Assessment
                  </Link>
                  <Link
                    href="/recommendations"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/recommendations') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Career Match
                  </Link>
                  <Link
                    href="/roadmap"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/roadmap') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Roadmap
                  </Link>
                  <Link
                    href="/tasks"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/tasks') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Tasks
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/portfolio') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Portfolio
                  </Link>
                  <Link
                    href="/linkedin-generator"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      isActive('/linkedin-generator') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    AI Post
                  </Link>
                  <Link
                    href="/report"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      isActive('/report') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Readiness Report
                  </Link>
                </>
              )}

              {user?.role === 'mentor' && (
                <>
                  <Link
                    href="/mentor"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/mentor') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Review Student Submissions
                  </Link>
                  <Link
                    href="/recruiter"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/recruiter') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    Talent Directory
                  </Link>
                </>
              )}

              {user?.role === 'recruiter' && (
                <>
                  <Link
                    href="/recruiter"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/recruiter') ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Verified Candidates
                  </Link>
                </>
              )}
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* AI Engine Badge */}
              <button
                onClick={() => setAiInfoOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                title="View AI Engine status & settings"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Engine: Active</span>
              </button>

              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all shadow-indigo-200"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
            {!user ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Home
                </Link>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="py-2 px-3 bg-slate-50 rounded-lg mb-2">
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase">{user.role}</p>
                </div>

                {user.role === 'student' && (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Dashboard</Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Profile</Link>
                    <Link href="/assessment" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Assessment</Link>
                    <Link href="/recommendations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Career Match</Link>
                    <Link href="/roadmap" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Roadmap</Link>
                    <Link href="/tasks" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Tasks</Link>
                    <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Portfolio</Link>
                    <Link href="/linkedin-generator" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">AI LinkedIn Post</Link>
                    <Link href="/report" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Readiness Report</Link>
                  </>
                )}

                {user.role === 'mentor' && (
                  <Link href="/mentor" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Review Student Submissions</Link>
                )}

                {user.role === 'recruiter' && (
                  <Link href="/recruiter" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700">Talent Directory</Link>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* AI Engine Details Modal */}
      {aiInfoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Road to Career Engine Architecture</h3>
                  <p className="text-xs text-slate-500">Transparent & Reliable Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setAiInfoOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1">Dual-Mode AI Architecture:</p>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li>
                    <span className="font-semibold text-emerald-700">Live Gemini LLM Mode:</span> Activated automatically whenever a <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">GEMINI_API_KEY</code> is configured on the server.
                  </li>
                  <li>
                    <span className="font-semibold text-indigo-700">Deterministic Curriculum Engine:</span> Runs when no external key is passed. Built on standardized tech industry blueprints, career taxonomies, and personalized heuristic rules.
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Fairness & Integrity:</strong> Every recommendation, roadmap, and post generation clearly identifies the engine used. We do not synthesize fake mentor approvals or fake recruiter matches.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAiInfoOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
