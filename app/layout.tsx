'use client'

import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import Providers from '@/components/Providers'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const GlobalChatBox = dynamic(
  () => import('@/components/messaging/GlobalChatBox'),
  { ssr: false }
)

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <title>WorkQit - Connecting Talent with Opportunity</title>
        <meta name="description" content="A dual-purpose platform connecting individuals with job opportunities and upskilling resources" />
      </head>
      <body className="min-h-screen bg-transparent font-[family-name:var(--font-space-grotesk)]">
        <Providers>
          {isAuthPage ? (
            <main className="min-h-screen w-full">
              {children}
            </main>
          ) : (
            <div className="min-h-screen flex">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <ConditionalFooter />
              </div>
            </div>
          )}
          {!isAuthPage && <GlobalChatBox />}
        </Providers>
      </body>
    </html>
  )
}