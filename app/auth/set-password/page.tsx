'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SetPasswordPage() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    label: '', 
    color: '', 
    requirements: [] as Array<{ label: string; met: boolean }> 
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEntering, setIsEntering] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Redirect if user already has a password
    if (user.hasPassword) {
      router.push('/profile')
      return
    }
  }, [user, router])

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  // Password strength calculator with requirements
  const calculatePasswordStrength = (password: string) => {
    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'At least 12 characters (recommended)', met: password.length >= 12 },
      { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { label: 'One number (0-9)', met: /[0-9]/.test(password) },
      { label: 'One special character (!@#$%^&*)', met: /[^a-zA-Z0-9]/.test(password) },
    ]

    const score = requirements.filter(req => req.met).length
    
    if (!password) return { score: 0, label: '', color: '', requirements }

    let label = ''
    let color = ''
    if (score <= 2) {
      label = 'Weak'
      color = 'bg-red-500'
    } else if (score <= 4) {
      label = 'Medium'
      color = 'bg-yellow-500'
    } else {
      label = 'Strong'
      color = 'bg-green-500'
    }

    return { score, label, color, requirements }
  }

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password set successfully! You can now login with email and password.')
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        setError(data.error || 'Failed to set password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
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

  if (!user) {
    return (
      <div className="auth-background h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-background h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className={`auth-panel w-full max-w-4xl space-y-4 py-6 md:py-8 auth-panel-pulse ${isEntering ? 'auth-panel-enter' : ''}`}>
        <div className="auth-holo-grid" aria-hidden="true" />
        
        <div className="space-y-2 text-center">
          <h2 className="auth-title text-2xl md:text-3xl lg:text-4xl">Set Your Password</h2>
          <p className="auth-subtitle text-sm md:text-base">
            Create a password to enable email/password login
          </p>
          <p className="auth-meta text-xs md:text-sm">
            Or{' '}
            <Link href="/profile" className="auth-link">
              skip for now
            </Link>
          </p>
        </div>

        {error && (
          <div className="glass-alert glass-alert-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="glass-alert glass-alert-success">
            {success}
          </div>
        )}

        <div className="glass-alert glass-alert-info">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 md:h-6 md:w-6 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm md:text-base font-medium text-blue-800">
                Why set a password?
              </h3>
              <p className="mt-1 text-xs md:text-sm text-blue-700">
                Setting a password allows you to login with either your email/password OR Google authentication, 
                giving you more flexibility and ensuring you can always access your account.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-2 text-left">
              <label htmlFor="password" className="auth-label text-sm md:text-base">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input py-2.5 md:py-3 text-sm md:text-base pr-10 md:pr-12"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1.5 mt-1.5">
                  <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 md:h-1.5 flex-1 rounded-full transition-colors ${
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs md:text-sm font-medium ${
                    passwordStrength.label === 'Weak' ? 'text-red-500' :
                    passwordStrength.label === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    Password Strength: {passwordStrength.label}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 text-[10px] md:text-xs">
                    {passwordStrength.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className={`${req.met ? 'text-green-500' : 'text-gray-400'} flex-shrink-0 text-sm`}>
                          {req.met ? '✓' : '○'}
                        </span>
                        <span className={`${req.met ? 'text-green-600' : 'text-gray-500'} truncate`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-left">
              <label htmlFor="confirmPassword" className="auth-label text-sm md:text-base">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass-input py-2.5 md:py-3 text-sm md:text-base pr-10 md:pr-12"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary auth-button w-full py-3 md:py-3.5 text-sm md:text-base disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? 'Setting Password...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  )
}