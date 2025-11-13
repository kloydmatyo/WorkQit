"use client"

import { useEffect, useState } from "react"
import { Briefcase, Users, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface Stats {
  applications: number
  interviews: number
  offers: number
  profile_views: number
}

interface Application {
  id: string
  jobTitle: string
  company: string
  status: string
  appliedDate: string
  jobType?: string
  location?: string
  remote?: boolean
}

interface Recommendation {
  id: string
  title: string
  company: string
  location: string
  remote: boolean
  type: string
  salary?: {
    min: number
    max: number
    currency: string
  }
}

const statusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "badge-soft border-amber-200/70 bg-amber-50/80 text-amber-600"
    case "reviewed":
      return "badge-soft border-blue-200/70 bg-blue-50/80 text-blue-600"
    case "accepted":
      return "badge-soft border-emerald-200/70 bg-emerald-50/80 text-emerald-600"
    case "rejected":
      return "badge-soft border-rose-200/70 bg-rose-50/80 text-rose-600"
    default:
      return "badge-soft"
  }
}

const statusCopy = (status: string) => {
  switch (status) {
    case "pending":
      return "Under Review"
    case "reviewed":
      return "Interview Scheduled"
    case "accepted":
      return "Accepted"
    case "rejected":
      return "Not Selected"
    default:
      return status
  }
}

const formatSalary = (salary?: Recommendation["salary"], type?: string) => {
  if (!salary || typeof salary.min !== "number" || typeof salary.max !== "number") {
    return ""
  }

  const currencyLabel = salary.currency ? `${salary.currency.toUpperCase()} ` : "$"
  const range = `${salary.min}-${salary.max}`
  const payDescriptor = type ? ` ${type.replace(/_/g, " ")}` : ""

  return ` • ${currencyLabel}${range}${payDescriptor}`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    interviews: 0,
    offers: 0,
    profile_views: 0,
  })
  const [applications, setApplications] = useState<Application[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const [statsRes, applicationsRes, recommendationsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/applications"),
        fetch("/api/dashboard/recommendations"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json()
        setApplications(applicationsData.applications)
      }

      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json()
        setRecommendations(recommendationsData.recommendations)
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-backdrop">
        <div className="container space-y-10 pb-16 pt-6">
          <div className="card animate-pulse px-8 py-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100/70" />
            <div className="mx-auto mt-6 h-6 w-1/3 rounded-full bg-slate-200/70" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={`stat-skeleton-${index}`} className="card animate-pulse px-6 py-8">
                <div className="h-12 w-12 rounded-2xl bg-slate-200/70" />
                <div className="mt-6 h-4 w-24 rounded-full bg-slate-200/60" />
                <div className="mt-3 h-6 w-16 rounded-full bg-slate-200/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-backdrop">
        <div className="container pb-20 pt-6">
          <div className="card border-red-200/60 bg-red-50/70 text-red-600">
            {error}
          </div>
        </div>
      </div>
    )
  }

  const statHighlights = [
    {
      id: "applications",
      label: "Applications",
      value: stats.applications,
      description: "Total applications submitted",
      icon: Briefcase,
      accent: "from-primary-500/20 via-primary-500/10 to-primary-500/5 text-primary-600",
    },
    {
      id: "interviews",
      label: "Interviews",
      value: stats.interviews,
      description: "Upcoming interviews scheduled",
      icon: Calendar,
      accent: "from-emerald-500/20 via-emerald-500/10 to-emerald-500/5 text-emerald-600",
    },
    {
      id: "offers",
      label: "Offers",
      value: stats.offers,
      description: "Offers received so far",
      icon: TrendingUp,
      accent: "from-violet-500/25 via-violet-500/10 to-violet-500/5 text-violet-600",
    },
    {
      id: "profile_views",
      label: "Profile Views",
      value: stats.profile_views,
      description: "Employers engaged with your profile",
      icon: Users,
      accent: "from-amber-500/20 via-amber-500/10 to-amber-500/5 text-amber-600",
    },
  ]

  return (
    <div className="dashboard-backdrop">
      <div className="container space-y-12 pb-20 pt-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Welcome back{user ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-base text-slate-500">
          Here's what's happening with your job search.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statHighlights.map((highlight) => {
          const Icon = highlight.icon
          return (
            <article key={highlight.id} className="card hover-lift hover-glow px-6 py-7">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${highlight.accent} shadow-soft`}
              >
                <Icon className="h-6 w-6 animate-float-soft" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{highlight.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{highlight.value}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">{highlight.description}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="card hover-lift hover-glow flex h-full flex-col gap-6 p-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Applications</h2>
              <p className="text-sm text-slate-500">Keep tabs on where each application stands.</p>
            </div>
            <Link href="/applications" className="btn-ghost text-sm font-semibold text-primary-600">
              View All
            </Link>
          </header>

          {applications.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/70 bg-white/70 p-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No applications yet
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Start applying to roles that match your interests and skills.
              </p>
              <Link href="/jobs" className="btn-primary mt-6">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-sm text-slate-500">{app.company}</p>
                    <p className="text-xs text-slate-400">
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={statusBadge(app.status)}>{statusCopy(app.status)}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card hover-lift hover-glow flex h-full flex-col gap-6 p-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recommended for You</h2>
              <p className="text-sm text-slate-500">
                Personalized roles based on your activity and interests.
              </p>
            </div>
            <Link href="/jobs" className="btn-ghost text-sm font-semibold text-primary-600">
              View All Jobs
            </Link>
          </header>

          {recommendations.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/70 bg-white/70 p-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No recommendations available
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Complete your profile to get personalized job recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    {job.location} {job.remote && "• Remote"}
                    {formatSalary(job.salary, job.type)}
                  </p>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors duration-200 hover:text-primary-700"
                  >
                    View Details
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
      </div>
    </div>
  )
}
