'use client'

import Hero from '@/components/LandingPage/Hero'
import Features from '@/components/LandingPage/Features'
import Stats from '@/components/LandingPage/Stats'
import JobSeekerHomepage from '@/components/homepage/JobSeekerHomepage'
import EmployerHomepage from '@/components/homepage/EmployerHomepage'
import MentorHomepage from '@/components/homepage/MentorHomepage'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Show role-specific homepage for authenticated users
if (user) {
  switch (user.role) {
    case 'employer':
      return <EmployerHomepage />
    case 'mentor':
      return <MentorHomepage />
    case 'job_seeker':
      return <JobSeekerHomepage />
    case 'admin':
      // Redirect to /admin or render AdminHomepage if you have one
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
        return null
      }
      return null
    default:
      return <JobSeekerHomepage />
  }
}

  // Default homepage for unauthenticated users (general landing page)
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-[22%] -top-[28%] h-[58rem] w-[58rem] rounded-full bg-primary-500/28 opacity-80 blur-[160px] animate-[auroraPulse_26s_ease-in-out_infinite_alternate]"
          aria-hidden
        />
        <div
          className="absolute right-[-25%] top-[32%] h-[54rem] w-[54rem] rounded-full bg-sky-400/28 opacity-75 blur-[150px] animate-[auroraPulse_30s_ease-in-out_infinite_alternate-reverse]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 bottom-[-18%] h-[65rem] w-[95rem] -translate-x-1/2 rounded-[9999px] bg-gradient-to-r from-primary-500/32 via-sky-500/20 to-purple-500/32 opacity-70 blur-[140px]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-[18%] h-[30rem] w-[80rem] -translate-x-1/2 skew-y-6 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70 blur-2xl"
          aria-hidden
        />
      </div>

      <div className="relative space-y-10 pt-4">
        {[Hero, Features, Stats].map((Section, index) => (
          <div
            key={Section.name}
            className={`animate-fade-in-up`}
            style={{ animationDelay: `${0.15 * index}s` }}
          >
            <Section />
          </div>
        ))}
      </div>
    </div>
  )
}