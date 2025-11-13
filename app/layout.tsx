import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import AuthDebug from '@/components/AuthDebug'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'WorkQit - Connecting Talent with Opportunity',
  description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} relative min-h-screen bg-transparent font-sans antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/40 to-white" aria-hidden />
              <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-primary-500/15 blur-3xl" aria-hidden />
              <div className="absolute left-[10%] top-[52%] h-64 w-64 rounded-full bg-secondary-500/12 blur-3xl" aria-hidden />
              <div className="absolute right-[8%] top-[30%] h-72 w-72 rounded-full bg-primary-600/10 blur-[120px]" aria-hidden />
            </div>

            <Navbar />
            <main className="flex-1 pt-20 pb-16 sm:pt-24">
              {children}
            </main>
            <Footer />
            <AuthDebug />
          </div>
        </Providers>
      </body>
    </html>
  )
}