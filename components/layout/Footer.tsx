import Link from 'next/link'

const linkClass =
  'group inline-flex items-center gap-2 text-base text-primary-600 transition-all duration-300 hover:text-primary-400 hover:-translate-y-0.5'

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-transparent pt-24 text-slate-600">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/70 to-transparent" aria-hidden />
        <div className="absolute left-[10%] top-[-20%] h-[32rem] w-[32rem] rounded-full bg-primary-500/18 blur-[150px] opacity-70" aria-hidden />
        <div className="absolute right-[8%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-sky-500/14 blur-[140px] opacity-60" aria-hidden />
      </div>

      <div className="container pb-16">
        <div className="auth-panel mx-auto flex max-w-5xl flex-col gap-16 p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 text-2xl font-semibold text-white shadow-soft">
                  WQ
                </span>
                <div className="flex flex-col">
                  <h3 className="text-aurora text-3xl font-bold tracking-[0.35em]">WORKQIT</h3>
                  <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.45em] text-primary-500">
                    <span className="inline-block h-1 w-1 rounded-full bg-primary-500" />
                    FUTURE OF ACCESS
                  </span>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-slate-500">
                Connecting talent with opportunity. Empowering individuals from low-income communities and recent graduates with job opportunities and upskilling resources.
              </p>
            </div>

            <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2">
              <div className="space-y-5">
                <h4 className="text-xl font-semibold text-slate-900">Platform</h4>
                <div className="flex flex-col space-y-3">
                  {[
                    { href: '/jobs', label: 'Find Jobs' },
                    { href: '/career-map', label: 'Career Map' },
                    { href: '/community', label: 'Community' },
                    { href: '/employers', label: 'For Employers' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className={linkClass}>
                      <span className="h-2 w-2 rounded-full bg-primary-600/80 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:bg-primary-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-xl font-semibold text-slate-900">Support</h4>
                <div className="flex flex-col space-y-3">
                  {[
                    { href: '/help', label: 'Help Center' },
                    { href: '/contact', label: 'Contact Us' },
                    { href: '/privacy', label: 'Privacy Policy' },
                    { href: '/terms', label: 'Terms of Service' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className={linkClass}>
                      <span className="h-2 w-2 rounded-full bg-primary-600/80 transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:bg-primary-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/40 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-base">
            <div>© 2025 WorkQit Platform. Built by Christian John Castillejo & Cloyd Matthew Arabe.</div>
            <div className="flex gap-6 text-slate-400">
              {['Status', 'Docs', 'Careers'].map((label) => (
                <span key={label} className="cursor-pointer transition-colors duration-300 hover:text-primary-400">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
