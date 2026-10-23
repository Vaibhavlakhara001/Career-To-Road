'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import Footer from './Footer';
import {
  LayoutDashboard,
  User as UserIcon,
  Sparkles,
  Compass,
  Map,
  CheckSquare,
  Briefcase,
  Share2,
  Award,
  Users,
  Search,
  Home,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Shield,
  ChevronRight,
  Code,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiInfoOpen, setAiInfoOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Student Navigation Items
  const studentNavDiscovery: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', icon: UserIcon },
    { label: 'Career Assessment', href: '/assessment', icon: Sparkles },
    { label: 'Career Match', href: '/recommendations', icon: Compass },
    { label: 'Learning Roadmap', href: '/roadmap', icon: Map },
  ];

  const studentNavEvidence: NavItem[] = [
    { label: 'Task Tracker', href: '/tasks', icon: CheckSquare },
    { label: 'Verified Portfolio', href: '/portfolio', icon: Briefcase },
    { label: 'AI LinkedIn Post', href: '/linkedin-generator', icon: Share2 },
    { label: 'Readiness Report', href: '/report', icon: Award, badge: 'Audit' },
  ];

  // Mentor Navigation Items
  const mentorNav: NavItem[] = [
    { label: 'Review Submissions', href: '/mentor', icon: Users },
    { label: 'Talent Directory', href: '/recruiter', icon: Search },
  ];

  // Recruiter Navigation Items
  const recruiterNav: NavItem[] = [
    { label: 'Verified Candidates', href: '/recruiter', icon: Briefcase },
  ];

  // Public / Guest Navigation Items
  const guestNav: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Sign In', href: '/login', icon: LogIn },
    { label: 'Create Account', href: '/signup', icon: UserPlus },
  ];

  // Derive current page title for breadcrumb
  const getPageTitle = () => {
    if (pathname === '/') return 'Overview & Solution';
    if (pathname.startsWith('/dashboard')) return 'Student Dashboard';
    if (pathname.startsWith('/profile')) return 'Student Profile';
    if (pathname.startsWith('/assessment')) return 'Career Interest Assessment';
    if (pathname.startsWith('/recommendations')) return 'Career Recommendations';
    if (pathname.startsWith('/roadmap')) return 'Personalized Learning Roadmap';
    if (pathname.startsWith('/tasks')) return 'Practical Task & Project Tracker';
    if (pathname.startsWith('/portfolio')) return 'Verified Evidence Portfolio';
    if (pathname.startsWith('/linkedin-generator')) return 'AI LinkedIn Post Drafter';
    if (pathname.startsWith('/report')) return 'Career Readiness Report';
    if (pathname.startsWith('/mentor')) return 'Mentor Review Dashboard';
    if (pathname.startsWith('/recruiter')) return 'Recruiter Talent Directory';
    if (pathname.startsWith('/login')) return 'Account Sign In';
    if (pathname.startsWith('/signup')) return 'Create Student Account';
    return 'Road to Career';
  };

  const renderNavLinks = (items: NavItem[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              active
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  active
                    ? 'bg-indigo-700/80 text-white'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-1 pb-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-150 transition-transform group-hover:scale-105">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                Road to Career
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Evidence & Skills Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation Legends Organized Vertically */}
        <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {user?.role === 'student' && (
            <>
              <div>
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Career Discovery
                </p>
                {renderNavLinks(studentNavDiscovery)}
              </div>

              <div>
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Practical Evidence
                </p>
                {renderNavLinks(studentNavEvidence)}
              </div>
            </>
          )}

          {user?.role === 'mentor' && (
            <div>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Mentor Workspace
              </p>
              {renderNavLinks(mentorNav)}
            </div>
          )}

          {user?.role === 'recruiter' && (
            <div>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recruiter Workspace
              </p>
              {renderNavLinks(recruiterNav)}
            </div>
          )}

          {!user && (
            <div>
              <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Navigation
              </p>
              {renderNavLinks(guestNav)}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        {/* AI Engine Status Button */}
        <button
          onClick={() => setAiInfoOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Engine: Active</span>
          </div>
          <span className="text-[10px] font-bold bg-white text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
            Info
          </span>
        </button>

        {/* User Profile Card or Auth Buttons */}
        {user ? (
          <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user.name}
                </p>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="py-2 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 antialiased">
      {/* 1. Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen z-30 flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Top Navigation Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">Road to Career</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* 3. Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-3.5 right-3.5">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* 4. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar (Subtle & Clean) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-400">Road to Career</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-800">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setAiInfoOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Engine: Active</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
                <span className="text-slate-500">Signed in as</span>
                <span className="font-bold text-slate-900">{user.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-600 border border-indigo-150">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* AI Architecture Information Modal */}
      {aiInfoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Road to Career Engine Architecture</h3>
                  <p className="text-xs text-slate-500">Transparent & Reliable Student Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setAiInfoOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">Dual-Mode AI Architecture:</p>
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  <li>
                    <strong className="text-emerald-700">Live Gemini LLM Mode:</strong> Automatically connects when a valid <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">GEMINI_API_KEY</code> is set in the server environment.
                  </li>
                  <li>
                    <strong className="text-indigo-700">Deterministic Blueprint Engine:</strong> Activates seamlessly when no external API key is provided, generating structured roadmaps, vetted courses, and practical project tasks without hallucinations.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Data Integrity Policy:</strong> Every recommendation and report clearly identifies the engine used. Road to Career never synthesizes fake mentor ratings or fake recruiter approvals.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAiInfoOpen(false)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}