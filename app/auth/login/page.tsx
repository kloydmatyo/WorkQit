'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [urlError, setUrlError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, error } = useAuth()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'google_oauth_not_configured') {
      setUrlError('Google Sign-In is currently not available. Please use email and password to sign in.')
    } else if (errorParam === 'google_oauth_failed') {
      setUrlError('Google Sign-In failed. Please try again or use email and password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔐 Login attempt started')
    console.log('📧 Email:', formData.email)
    console.log('🔑 Password length:', formData.password.length)
    
    setLoading(true)
    setSuccess('')

    try {
      console.log('📡 Sending login request...')
      const result = await login(formData)

      if (result.success) {
        console.log('✅ Login successful!')
        setSuccess('Login successful! Redirecting to your homepage...')
        
        // Redirect to homepage which will show role-specific content
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
        
    } catch (error) {
      console.error('💥 Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-[18%] -top-[28%] h-[55rem] w-[55rem] rounded-full bg-primary-500/28 opacity-70 blur-[150px] animate-[auroraPulse_22s_ease-in-out_infinite_alternate]"
          aria-hidden
        />
        <div
          className="absolute right-[-22%] top-[35%] h-[50rem] w-[50rem] rounded-full bg-sky-400/22 opacity-60 blur-[140px] animate-[auroraPulse_26s_ease-in-out_infinite_alternate-reverse]"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-1/4 h-[42rem] w-[85rem] -translate-x-1/2 rounded-[9999px] bg-gradient-to-r from-primary-500/30 via-sky-500/18 to-purple-500/28 opacity-65 blur-[130px]"
          aria-hidden
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="auth-panel w-full max-w-2xl space-y-12 p-16 animate-scale-in">
          <div className="auth-accent-ring" aria-hidden />
          <div className="space-y-5 text-center">
            <span className="pill typing-animation text-primary-600 px-7 py-3 text-3xl font-semibold uppercase tracking-[0.35em]">Welcome Back</span>
            <h2 className="text-aurora text-[2.75rem] font-semibold leading-tight">Sign in to your account</h2>
            <p className="text-lg text-slate-500">
              Or{' '}
              <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-500 underline-animated">
                create a new account
              </Link>
            </p>
          </div>

          <div className="mt-6 space-y-8">
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/60" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = '/api/auth/google')}
              className="btn-secondary hover-lift w-full justify-center border-white/70 bg-white/90 py-3.5 text-lg text-slate-600 hover:border-primary-200 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="ml-2 font-semibold">Sign in with Google</span>
            </button>
          </div>

          <form className="mt-12 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }} onSubmit={handleSubmit}>
            {(error || urlError) && (
              <div className="rounded-2xl border border-red-200/70 bg-red-50/80 px-5 py-4 text-sm font-medium text-red-600">
                {urlError || error}
                {error && error.includes('verify your email') && (
                  <div className="mt-2">
                    <Link
                      href="/auth/verify-email"
                      className="font-semibold text-red-700 underline hover:text-red-800"
                    >
                      Resend verification email
                    </Link>
                  </div>
                )}
                {error && error.includes('set a password') && (
                  <div className="mt-2 text-sm text-red-700">
                    You can also{' '}
                    <Link
                      href="/auth/set-password"
                      className="font-semibold underline hover:text-red-800"
                    >
                      set a password
                    </Link>
                    {' '}to login with email and password.
                  </div>
                )}
              </div>
            )}
            
            {success && (
              <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-5 py-4 text-sm font-medium text-emerald-600">
                {success}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="input-label text-lg">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-3 text-xl"
                />
              </div>
            
              <div>
                <label htmlFor="password" className="input-label text-lg">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-3 text-xl"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary hover-lift w-full justify-center py-4 text-lg font-semibold disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}