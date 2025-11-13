'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

interface Job {
  _id: string
  title: string
  description: string
  company: string
  type: string
  location: string
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    remote: '',
    skills: '',
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverLetter: 'I am interested in this position and would like to apply.'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Application submitted successfully!')
        // Optionally refresh the jobs list or redirect to dashboard
      } else {
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('An error occurred while submitting your application')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-aurora text-[3rem] font-semibold leading-tight tracking-tight animate-fade-in-up">
          Find Your Next Opportunity
        </h1>
        <p className="mt-4 text-lg text-slate-500 animate-[fade-in-up_0.6s_ease-out_forwards] animate-delay-200">
          Discover internships, apprenticeships, and job opportunities that match your skills and goals.
        </p>
      </div>

      {/* Filters */}
      <div className="auth-panel animate-fade-in-up mb-10" style={{ animationDelay: '0.15s' }}>
        <div className="auth-accent-ring" aria-hidden />
        <div className="glow-divider mb-10" />
        <div className="grid gap-6 px-8 pb-12 md:grid-cols-4">
          <div className="space-y-3 text-center md:text-left">
            <label className="input-label text-base uppercase tracking-[0.35em] text-primary-600">
              Job Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-lg text-slate-600 shadow-subtle transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            >
              <option value="">All Types</option>
              <option value="internship">Internship</option>
              <option value="apprenticeship">Apprenticeship</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <label className="input-label text-base uppercase tracking-[0.35em] text-primary-600">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter city or state"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-lg text-slate-600 shadow-subtle transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>

          <div className="space-y-3 text-center md:text-left">
            <label className="input-label text-base uppercase tracking-[0.35em] text-primary-600">
              Remote Work
            </label>
            <select
              value={filters.remote}
              onChange={(e) => handleFilterChange('remote', e.target.value)}
              className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-lg text-slate-600 shadow-subtle transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            >
              <option value="">All Options</option>
              <option value="true">Remote Only</option>
              <option value="false">On-site Only</option>
            </select>
          </div>

          <div className="space-y-3 text-center md:text-left">
            <label className="input-label text-base uppercase tracking-[0.35em] text-primary-600">
              Skills
            </label>
            <input
              type="text"
              placeholder="e.g. JavaScript, React"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="rounded-3xl border border-white/60 bg-white/80 px-5 py-3 text-lg text-slate-600 shadow-subtle transition-all duration-300 focus:border-primary-300 focus:ring-primary-200"
            />
          </div>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No jobs found matching your criteria.</p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job._id}
                className="card hover-lift hover-glow space-y-7 p-9 animate-[fade-in-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${0.08 * index}s` }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-gradient text-[2.35rem] font-semibold leading-tight">{job.title}</h3>
                    <p className="text-lg font-semibold text-primary-600">{job.company}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-primary-200/70 bg-primary-500/10 px-5 py-1.5 text-base font-semibold text-primary-600">
                    {job.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-lg leading-relaxed text-slate-600 line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-slate-500">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-subtle">
                    <MapPin className="h-6 w-6 text-primary-500" />
                    <span>
                      {job.location} {job.remote && <span className="text-primary-500">• Remote</span>}
                    </span>
                  </div>

                  {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-subtle">
                      <DollarSign className="h-6 w-6 text-primary-500" />
                      <span>
                        ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-subtle">
                    <Clock className="h-6 w-6 text-primary-500" />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-primary-200/70 bg-primary-50/60 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => handleApply(job._id)}
                    className="btn-primary hover-lift justify-center px-10 py-3.5 text-lg"
                  >
                    Apply Now
                  </button>
                  <Link
                    href={`/jobs/${job._id}`}
                    className="group inline-flex items-center gap-3 text-lg font-semibold text-primary-500 transition-all duration-300 hover:text-primary-300"
                  >
                    View Details
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-200/70 bg-primary-500/10 text-primary-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}