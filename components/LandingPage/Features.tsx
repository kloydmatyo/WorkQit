import { CheckCircle, Users, BarChart3, MapPin, MessageSquare, Building } from 'lucide-react'

const features = [
  {
    icon: Building,
    title: 'Employer Dashboard',
    description: 'Post internships, apprenticeships, and jobs. Evaluate candidates with structured templates and track progress.',
  },
  {
    icon: BarChart3,
    title: 'Performance Tools',
    description: 'Comprehensive feedback loops with ratings, skill assessments, and exportable performance reports.',
  },
  {
    icon: MapPin,
    title: 'Career Map Builder',
    description: 'Interactive career visualization from entry-level to senior roles with personalized roadmaps.',
  },
  {
    icon: CheckCircle,
    title: 'Smart Job Matching',
    description: 'Intelligent filters for location, skills, and availability to find the perfect opportunities.',
  },
  {
    icon: MessageSquare,
    title: 'Community Forums',
    description: 'Peer forums for sharing experiences, tips, and advice with fellow job seekers.',
  },
  {
    icon: Users,
    title: 'Mentorship Program',
    description: 'Connect with professional mentors and alumni for guidance and career support.',
  },
]

export default function Features() {
  return (
    <section className="relative isolate overflow-hidden py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-white via-primary-50/35 to-white" aria-hidden />
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading animate-fade-in-up">
            Everything You Need to Succeed
          </h2>
          <p className="section-subheading mx-auto mt-4 animate-fade-in-up text-lg leading-relaxed text-slate-600">
            Our comprehensive platform provides tools for job seekers, employers, and mentors to create meaningful connections and career growth opportunities.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="card animate-fade-in-up px-7 py-8 hover-lift hover-glow"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/15 via-primary-500/20 to-primary-500/30 text-primary-600 shadow-soft transition-transform duration-300 hover:scale-110">
                  <Icon className="h-6 w-6 animate-float-soft" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900 underline-animated">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}