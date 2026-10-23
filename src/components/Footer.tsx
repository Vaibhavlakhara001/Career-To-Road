import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Shield, Code, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Road to Career</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering students to discover their ideal technology paths, master practical skills, build verifiable project evidence, and connect with mentors and recruiters.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Data Privacy & Role-Based Access
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Evidence-Based Portfolios
              </span>
            </div>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Student Hub</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/assessment" className="hover:text-white transition-colors">Career Assessment</Link></li>
              <li><Link href="/recommendations" className="hover:text-white transition-colors">Career Recommendations</Link></li>
              <li><Link href="/roadmap" className="hover:text-white transition-colors">Learning Roadmaps</Link></li>
              <li><Link href="/tasks" className="hover:text-white transition-colors">Task Tracker</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Verified Portfolio</Link></li>
            </ul>
          </div>

          {/* Mentors & Talent */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Ecosystem</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentor" className="hover:text-white transition-colors">Mentor Review Portal</Link></li>
              <li><Link href="/recruiter" className="hover:text-white transition-colors">Recruiter Talent Search</Link></li>
              <li><Link href="/report" className="hover:text-white transition-colors">Career Readiness Reports</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Account Access</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Road to Career. All rights reserved. Built for student career readiness.</p>
          <p className="flex items-center gap-1">
            Engineered with <Code className="w-3.5 h-3.5 text-indigo-400" /> Next.js, React, Tailwind CSS, & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
