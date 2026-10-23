'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Briefcase,
  ExternalLink,
  Star,
  CheckCircle2,
  Share2,
  Award,
  Calendar,
  Layers,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  ShieldCheck,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';
import { TaskItem, StudentProfile, PersonalizedRoadmap } from '@/lib/types';

export default function PortfolioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadPortfolio();
    }
  }, [user, authLoading, router]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const [tasksRes, profileRes, roadmapRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/profile'),
        fetch('/api/roadmap'),
      ]);

      if (tasksRes.ok) {
        const tData = await tasksRes.json();
        setTasks(tData.tasks || []);
      }
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.profile);
      }
      if (roadmapRes.ok) {
        const rData = await roadmapRes.json();
        setRoadmap(rData.roadmap);
      }
    } catch (e) {
      console.error('Error fetching portfolio data', e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Assembling verified project evidence...</p>
      </div>
    );
  }

  // Include tasks that have been marked completed OR have submissions
  const completedProjects = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'submitted' || !!t.submission
  );

  const allSkillsPracticed = Array.from(
    new Set(completedProjects.flatMap((p) => p.skills || []))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Portfolio Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Verified Practical Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {profile?.fullName || user?.name}'s Project Showcase
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            {profile?.ambitions || 'Aspiring technology specialist'} • {roadmap?.careerTitle || 'Career Track'}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
            <span><strong>{completedProjects.length}</strong> Completed Projects</span>
            <span>•</span>
            <span><strong>{allSkillsPracticed.length}</strong> Demonstrated Skills</span>
            <span>•</span>
            <span className={profile?.shareWithRecruiters ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
              {profile?.shareWithRecruiters ? '✓ Visible to Recruiters' : 'Private'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/report"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-250 transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>View Career Readiness Report</span>
          </Link>
          <Link
            href="/roadmap"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            View Roadmap
          </Link>
          <Link
            href="/tasks"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Manage Tasks
          </Link>
        </div>
      </div>

      {/* Skills Practiced Cloud */}
      {allSkillsPracticed.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Skills Demonstrated Across Completed Projects
          </h3>
          <div className="flex flex-wrap gap-2">
            {allSkillsPracticed.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-white text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <span>Completed Evidence Deliverables ({completedProjects.length})</span>
        </h2>

        {completedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedProjects.map((project) => {
              const isVerified = project.status === 'completed';
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Screenshot Thumbnail if available */}
                    {project.submission?.screenshotUrl && (
                      <div className="w-full h-48 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                        <img
                          src={project.submission.screenshotUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {project.submission?.submittedAt
                              ? new Date(project.submission.submittedAt).toLocaleDateString()
                              : 'Completed'}
                          </span>
                          {isVerified ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Complete
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              Under Review
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                        {project.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Implementation Notes */}
                      {project.submission?.notes && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{project.submission.notes}"
                        </p>
                      )}

                      {/* Skills pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-150"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Mentor Feedback Banner */}
                      {project.feedback && (
                        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-950">
                              Mentor Review by {project.feedback.mentorName}
                            </span>
                            <div className="flex items-center text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < project.feedback!.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-purple-900 italic">
                            "{project.feedback.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-3">
                    {project.submission?.projectUrl ? (
                      <a
                        href={project.submission.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 truncate"
                      >
                        <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">View Code / Live Demo</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <Link
                        href={`/tasks?open=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Project Proof</span>
                      </Link>
                    )}

                    <button
                      onClick={() => router.push(`/linkedin-generator?taskId=${project.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Your portfolio is currently empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you complete tasks on your roadmap or upload deliverables (code links and screenshots), they will appear here as verified evidence of your abilities.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-250 transition-colors"
              >
                Go to Learning Roadmap
              </Link>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Open Task Tracker
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}