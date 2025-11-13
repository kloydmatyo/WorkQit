'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Clock, DollarSign, Building, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import JobApplicationModal from '@/components/JobApplicationModal'
import { useAuth } from '@/contexts/AuthContext'

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
  requirements: string[]
  skills: string[]
  duration?: string
  createdAt: string
  employerId: {
    firstName: string
    lastName: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string)
      if (user?.role === 'job_seeker') {
        checkApplicationStatus(params.id as string)
      }
    }
  }, [params.id, user])

  const fetchJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      } else {
        setError('Job not found')
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const checkApplicationStatus = async (jobId: string) => {
    try {
      const response = await fetch('/api/dashboard/applications', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        const hasAppliedToJob = data.applications?.some((app: any) => app.job._id === jobId)
        setHasApplied(hasAppliedToJob)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const handleApplyClick = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'job_seeker') {
      alert('Only job seekers can apply to jobs.')
      return
    }

    setShowApplicationModal(true)
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowApplicationModal(false)
  }

  if (loading) {
    return (
      <div className="container py-16 animate-fade-in-up">
        <div className="auth-panel flex flex-col gap-6 p-12">
          <div className="auth-accent-ring" aria-hidden />
          <div className="h-8 w-1/3 rounded-full bg-slate-200/80" />
          <div className="h-4 w-1/2 rounded-full bg-slate-200/60" />
          <div className="h-72 rounded-3xl border border-white/20 bg-white/70" />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || 'Job not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container space-y-10 py-16">
      <div className="animate-fade-in-up">
        <Link
          href="/jobs"
          className="group inline-flex items-center text-primary-600 hover:text-primary-400"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="auth-panel animate-[scale-in_0.45s_ease-out_forwards] p-12">
        <div className="auth-accent-ring" aria-hidden />
        <div className="glow-divider" />

        <div className="space-y-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-5 max-w-2xl">
              <h1 className="text-aurora text-[2.75rem] font-semibold leading-tight md:text-[3rem]">
                {job.title}
              </h1>
              <div className="inline-flex items-center gap-3 rounded-full border border-primary-200/70 bg-primary-50/70 px-5 py-2 text-lg font-semibold text-primary-600 shadow-subtle">
                <Building className="h-6 w-6" />
                {job.company}
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border border-primary-200/70 bg-primary-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.45em] text-primary-600">
              {job.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid gap-6 rounded-3xl border border-white/45 bg-white/70 p-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.4em] text-primary-500">
                <MapPin className="h-5 w-5" />
                Location
              </div>
              <div className="text-xl font-medium text-slate-600">
                {job.location}
                {job.remote && <span className="ml-2 text-primary-500">• Remote</span>}
              </div>
            </div>

            {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.4em] text-primary-500">
                  <DollarSign className="h-5 w-5" />
                  Salary
                </div>
                <div className="text-xl font-medium text-slate-600">
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.4em] text-primary-500">
                  <DollarSign className="h-5 w-5" />
                  Salary
                </div>
                <div className="text-xl font-medium text-slate-500">Not specified</div>
              </div>
            )}

            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.4em] text-primary-500">
                <Clock className="h-5 w-5" />
                Posted
              </div>
              <div className="text-xl font-medium text-slate-600">
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <section className="space-y-5">
            <h2 className="text-aurora text-2xl font-semibold">Job Description</h2>
            <p className="text-lg leading-relaxed text-slate-600 whitespace-pre-line">{job.description}</p>
          </section>

          {job.requirements.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-aurora text-2xl font-semibold">Requirements</h2>
              <ul className="grid gap-3 text-lg text-slate-600">
                {job.requirements.map((req, index) => (
                  <li key={index} className="rounded-2xl border border-white/50 bg-white/70 px-5 py-3 shadow-subtle">
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-aurora text-2xl font-semibold">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-primary-200/70 bg-primary-50/60 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.25em] text-primary-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="border-t border-white/50 pt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-base font-semibold uppercase tracking-[0.35em] text-slate-400">
                Posted by {job.employerId.firstName} {job.employerId.lastName}
              </div>

              {user?.role === 'job_seeker' ? (
                hasApplied ? (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-600">
                      ✓ Applied
                    </span>
                    <Link href="/applications" className="text-primary-500 hover:text-primary-300 text-sm font-semibold">
                      View Application
                    </Link>
                  </div>
                ) : (
                  <button onClick={handleApplyClick} className="btn-primary hover-lift px-8 py-3 text-base">
                    Apply Now
                  </button>
                )
              ) : user?.role === 'employer' ? (
                <Link
                  href={`/jobs/${job._id}/applicants`}
                  className="text-primary-500 hover:text-primary-300 text-sm font-semibold"
                >
                  View Applicants
                </Link>
              ) : (
                <Link href="/auth/login" className="btn-primary hover-lift px-10 py-3.5 text-lg">
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {job && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          jobId={job._id}
          jobTitle={job.title}
          company={job.company}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}