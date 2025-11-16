'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, Link as LinkIcon, Video, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateWebinarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    duration: 60,
    meetLink: '',
    maxAttendees: 100,
    category: 'other',
    tags: '',
  });

  // Redirect if not mentor or admin
  if (user && !['mentor', 'admin'].includes(user.role)) {
    router.push('/webinars');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/webinars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/webinars/${data.webinar._id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create webinar');
      }
    } catch (error) {
      console.error('Error creating webinar:', error);
      alert('Failed to create webinar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/webinars"
          className="group/back mb-8 inline-flex items-center gap-3 text-base font-semibold text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 group-hover/back:-translate-x-1 transition-transform" />
          Back to webinars
        </Link>

        {/* Form Card */}
        <div className="card relative overflow-hidden group/form hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/form:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                <Video className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Create New Webinar
              </h1>
            </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="auth-label mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Webinar Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="glass-input w-full px-5 py-4 text-base"
                placeholder="e.g., Mastering Technical Interviews"
              />
            </div>

            {/* Description */}
            <div>
              <label className="auth-label mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={8}
                className="glass-input w-full px-5 py-4 text-base resize-none"
                placeholder="Describe what attendees will learn..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="auth-label mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-5 py-4 text-base"
                />
              </div>

              <div>
                <label className="auth-label mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="15"
                  max="240"
                  className="glass-input w-full px-5 py-4 text-base"
                />
              </div>
            </div>

            {/* Google Meet Link */}
            <div>
              <label className="auth-label mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                  <LinkIcon className="h-4 w-4 text-green-600" />
                </div>
                Google Meet Link
              </label>
              <input
                type="url"
                name="meetLink"
                value={formData.meetLink}
                onChange={handleChange}
                className="glass-input w-full px-5 py-4 text-base"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
              <div className="mt-4 rounded-xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-blue-100/50 p-6 backdrop-blur">
                <p className="mb-4 text-base font-bold text-blue-900 flex items-center gap-2">
                  <span>📝</span>
                  How to create a Google Meet link:
                </p>
                <ol className="ml-6 list-decimal space-y-2 text-base text-blue-700 font-medium">
                  <li>Go to <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="auth-link underline">meet.google.com</a></li>
                  <li>Click "New meeting" → "Create a meeting for later"</li>
                  <li>Copy the meeting link and paste it above</li>
                </ol>
                <p className="mt-4 text-base text-blue-600 font-semibold flex items-center gap-2">
                  <span>💡</span>
                  Registered attendees will see this link and can add the webinar to their Google Calendar automatically!
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="auth-label mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="glass-input w-full px-5 py-4 text-base"
              >
                <option value="career_development">Career Development</option>
                <option value="technical_skills">Technical Skills</option>
                <option value="interview_prep">Interview Preparation</option>
                <option value="industry_insights">Industry Insights</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Max Attendees */}
            <div>
              <label className="auth-label mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min="1"
                max="500"
                className="glass-input w-full px-5 py-4 text-base"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="auth-label mb-4 block">
                Topics/Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="glass-input w-full px-5 py-4 text-base"
                placeholder="e.g., JavaScript, React, Career Tips (comma-separated)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="relative flex-1 flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                {loading ? (
                  <>
                    <div className="futuristic-loader-inner w-5 h-5"></div>
                    <span className="relative z-10">Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                    <span className="relative z-10">Create Webinar</span>
                  </>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
              </button>
              <Link
                href="/webinars"
                className="relative flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold rounded-xl border-2 border-gray-300/50 bg-white/60 backdrop-blur-xl text-gray-700 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-gray-400/70 hover:bg-white/80 overflow-hidden group/cancel"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-gray-400/5 to-gray-500/5 opacity-0 group-hover/cancel:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <span className="relative z-10">Cancel</span>
              </Link>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
