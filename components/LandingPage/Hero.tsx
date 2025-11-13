import Link from 'next/link'
import { ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react'

interface User {
  firstName: string
  lastName: string
  role: string
}

interface HeroProps {
  user?: User
}

const highlightCards = [
  {
    icon: Briefcase,
    title: 'Job Opportunities',
    copy: 'Access local and remote internships, apprenticeships, and gig work',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    copy: 'Interactive career maps and personalized upskilling roadmaps',
  },
  {
    icon: Users,
    title: 'Community Support',
    copy: 'Connect with mentors, peers, and industry professionals',
  },
]

export default function Hero({ user }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-10 sm:pb-20 sm:pt-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-br from-primary-50 via-white to-primary-50/40" aria-hidden />
      <div className="absolute left-1/2 top-10 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary-500/15 blur-3xl" aria-hidden />
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {user && (
            <div className="pill mx-auto mb-6 animate-fade-in-up">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Welcome back, {user.firstName}!
            </div>
          )}
          <h1 className="text-aurora animate-fade-in-up text-4xl font-bold sm:text-5xl md:text-6xl">
            {user ? 'Continue Your Journey to ' : 'Bridge the Gap Between '}
            <span className="bg-gradient-to-r from-primary-500 via-sky-400 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-x">
              {user ? 'Success' : 'Education & Opportunity'}
            </span>
          </h1>
          <p className="mt-6 animate-fade-in-up text-lg leading-relaxed text-slate-600 sm:text-xl">
            {user
              ? 'Explore new opportunities, track your applications, and continue building your career with personalized recommendations.'
              : 'Connect with short-term jobs, remote internships, and apprenticeships while accessing free upskilling resources. Designed for individuals from low-income communities and recent graduates.'}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {(user
              ? [
                  { href: '/dashboard', label: 'View Dashboard', primary: true },
                  { href: '/jobs', label: 'Browse Jobs', primary: false },
                ]
              : [
                  { href: '/auth/register', label: 'Get Started', primary: true },
                  { href: '/jobs', label: 'Browse Jobs', primary: false },
                ]
            ).map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={`group ${cta.primary ? 'btn-primary' : 'btn-secondary'} hover-lift px-10 py-3.5 text-lg`}
              >
                {cta.label}
                {cta.primary && (
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {highlightCards.map((card, index) => (
            <div
              key={card.title}
              className="card group animate-fade-in-up px-6 py-8 hover-lift hover-glow"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-500/30 text-primary-600 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-soft">
                <card.icon className="h-6 w-6 animate-float-soft" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{card.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}