'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { CounterProvider } from '@/contexts/CounterContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CounterProvider>
        {children}
      </CounterProvider>
    </AuthProvider>
  )
}