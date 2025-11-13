const stats = [
  { number: '10,000+', label: 'Job Seekers' },
  { number: '500+', label: 'Employers' },
  { number: '2,500+', label: 'Jobs Posted' },
  { number: '85%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="relative isolate overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-transparent" aria-hidden />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading animate-fade-in-up">
            Making Impact Together
          </h2>
          <p className="section-subheading mx-auto mt-4 animate-fade-in-up text-lg leading-relaxed text-slate-600">
            Join thousands of individuals and employers creating opportunities for growth.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card flex flex-col items-center justify-center py-8 text-center hover-lift hover-glow"
              style={{ animationDelay: `${0.05 * (index + 1)}s` }}
            >
              <div className="text-gradient text-4xl font-bold md:text-5xl">
                {stat.number}
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500 underline-animated md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
