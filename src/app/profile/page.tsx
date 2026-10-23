'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  User,
  GraduationCap,
  Heart,
  Lightbulb,
  Wrench,
  Target,
  Compass,
  Globe,
  Linkedin,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [qualification, setQualification] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [ambitions, setAmbitions] = useState('');
  const [futureGoals, setFutureGoals] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [shareWithRecruiters, setShareWithRecruiters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        const p: StudentProfile = data.profile;
        if (p) {
          setFullName(p.fullName || user?.name || '');
          setQualification(p.qualification || '');
          setHobbies(p.hobbies || []);
          setInterests(p.interests || []);
          setSkills(p.skills || []);
          setAmbitions(p.ambitions || '');
          setFutureGoals(p.futureGoals || '');
          setPreferredLanguage(p.preferredLanguage || 'English');
          setLinkedInUrl(p.linkedInUrl || '');
          setShareWithRecruiters(p.shareWithRecruiters || false);
        }
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setInput('');
    }
  };

  const handleRemoveTag = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          qualification,
          hobbies,
          interests,
          skills,
          ambitions,
          futureGoals,
          preferredLanguage,
          linkedInUrl,
          shareWithRecruiters,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMessage('Student profile saved successfully! Redirecting you to the Career Assessment quiz...');
      setTimeout(() => {
        router.push('/assessment?from=profile');
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating profile');
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium mt-3">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Student Profile & Aspirations</h1>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Verified Student
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Provide details about your education, current capabilities, and ambitions to generate precision career roadmaps.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-250 transition-all flex items-center justify-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving & Redirecting...' : 'Save & Continue to Quiz'}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Identity & Qualification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Academic Background & Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Current Qualification / Degree
              </label>
              <input
                type="text"
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. B.Tech Computer Science (3rd Year), High School Senior, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Preferred Learning Language
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Hindi">Hindi</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                LinkedIn Profile URL (Optional)
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Competencies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <span>Technical & Practical Skills</span>
            </h2>
            <span className="text-xs text-slate-400">Type a skill and press Enter or Add</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newSkill, skills, setSkills, setNewSkill);
                }
              }}
              placeholder="e.g. React, Python, SQL, Figma, Docker"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="button"
              onClick={() => handleAddTag(newSkill, skills, setSkills, setNewSkill)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, skills, setSkills)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills added yet. Add at least 2-3 to receive tailored roadmaps.</span>
            )}
          </div>
        </div>

        {/* Interests & Hobbies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Professional Interests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              <span>Professional Interests</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newInterest, interests, setInterests, setNewInterest);
                  }
                }}
                placeholder="e.g. AI Models, Cloud Systems, UI/UX"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newInterest, interests, setInterests, setNewInterest)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 min-h-[36px]">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200"
                >
                  {interest}
                  <button type="button" onClick={() => handleRemoveTag(index, interests, setInterests)}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Personal Hobbies */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Hobbies & Free-Time Activities</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newHobby, hobbies, setHobbies, setNewHobby);
                  }
                }}
                placeholder="e.g. Gaming, Digital Drawing, Chess"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newHobby, hobbies, setHobbies, setNewHobby)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 min-h-[36px]">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200"
                >
                  {hobby}
                  <button type="button" onClick={() => handleRemoveTag(index, hobbies, setHobbies)}>
                    <X className="w-3 h-3 hover:text-rose-600" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ambitions & Future Goals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Ambitions & Future Career Goals</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Current Ambition / Dream Role
              </label>
              <input
                type="text"
                value={ambitions}
                onChange={(e) => setAmbitions(e.target.value)}
                placeholder="e.g. Full-Stack Engineer at an innovative high-growth startup"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Long-Term Future Vision (3-5 Years)
              </label>
              <textarea
                rows={3}
                value={futureGoals}
                onChange={(e) => setFutureGoals(e.target.value)}
                placeholder="Describe what kind of projects you want to build, technologies you want to lead, or the impact you hope to achieve."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Recruiter Visibility Preference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
          <input
            id="recruiter-toggle"
            type="checkbox"
            checked={shareWithRecruiters}
            onChange={(e) => setShareWithRecruiters(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-1 cursor-pointer"
          />
          <div>
            <label htmlFor="recruiter-toggle" className="font-bold text-sm text-slate-900 cursor-pointer">
              Share Career-Readiness Report with Vetted Recruiters
            </label>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              When checked, talent partners and tech recruiters on Road to Career can view your completed project evidence, verified skills, and mentor feedback. You can toggle this off anytime.
            </p>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push('/assessment')}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Next: Take Career Assessment →
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-250 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving & Redirecting...' : 'Save Profile & Continue to Career Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
}
