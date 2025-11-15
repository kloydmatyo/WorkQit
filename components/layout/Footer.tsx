import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/20 bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white/90">
      {/* Animated Background Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.25) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.25) 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px',
          animation: 'footerGridMove 15s linear infinite'
        }}></div>
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 right-0 h-full w-[28rem] translate-x-1/4 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_60%)] blur-2xl" style={{
          animation: 'footerOrbPulse 6s ease-in-out infinite'
        }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.45),transparent_60%)]" style={{
          animation: 'footerOrbPulse 8s ease-in-out infinite 1s'
        }}></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(14,165,233,0.35),transparent_70%)] blur-3xl rounded-full" style={{
          animation: 'footerOrbPulse 10s ease-in-out infinite 2s'
        }}></div>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/30 to-transparent"></div>
        
        {/* Floating Particles - More and Larger */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-white/60 blur-sm" style={{
          animation: 'footerFloat 10s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 rounded-full bg-blue-300/50 blur-md" style={{
          animation: 'footerFloat 12s ease-in-out infinite 1.5s',
          boxShadow: '0 0 25px rgba(147, 197, 253, 0.6)'
        }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-white/50 blur-sm" style={{
          animation: 'footerFloat 14s ease-in-out infinite 3s',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan-300/40 blur-sm" style={{
          animation: 'footerFloat 11s ease-in-out infinite 2s',
          boxShadow: '0 0 15px rgba(103, 232, 249, 0.5)'
        }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-white/45 blur-sm" style={{
          animation: 'footerFloat 13s ease-in-out infinite 4s',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
        }}></div>
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="footer-panel grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <h3 className="footer-heading">WorkQit</h3>
            <p className="footer-subheading">
              Connecting talent with opportunity. Empowering individuals from
              low-income communities and recent graduates with job opportunities
              and upskilling resources.
            </p>
          </div>

          <div className="lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <h4 className="text-2xl font-semibold text-white">Platform</h4>
              <ul className="footer-link-group">
                <li>
                <Link href="/jobs" className="footer-link">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career-map"
                  className="footer-link"
                  >
                    Career Map
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                  className="footer-link"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employers"
                  className="footer-link"
                  >
                    For Employers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-10 space-y-6 lg:mt-0">
              <h4 className="text-2xl font-semibold text-white">Support</h4>
              <ul className="footer-link-group">
                <li>
                <Link href="/help" className="footer-link">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                  className="footer-link"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                  className="footer-link"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                <Link href="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-white/20 bg-white/8 py-8 text-center text-base text-white/80 shadow-[0_35px_70px_-50px_rgba(15,23,42,0.8)] backdrop-blur-2xl">
          <p className="text-lg font-semibold tracking-wide text-white/85 md:text-xl">
            © 2025 WorkQit Platform. Built by Christian John Castillejo & Cloyd
            Matthew Arabe.
          </p>
        </div>
      </div>
    </footer>
  );
}
