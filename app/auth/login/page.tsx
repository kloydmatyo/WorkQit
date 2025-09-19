'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🔐 Login attempt started')
    console.log('📧 Email:', formData.email)
    console.log('🔑 Password length:', formData.password.length)
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('📡 Sending login request...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Ensure cookies are included
      })

      console.log('📨 Response status:', response.status)
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Login failed:', errorData.error)
        setError(errorData.error || 'Login failed')
        return
      }

      const data = await response.json()
      console.log('📨 Response data:', data)
      console.log('✅ Login successful!')
      
      setSuccess('Login successful! Verifying session...')
      
      // Wait for cookie to be set and verify authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('🔍 Verifying authentication status...')
      
      // Test if we're actually authenticated before redirecting
      try {
        const authTest = await fetch('/api/test-auth')
        const authData = await authTest.json()
        console.log('🧪 Auth verification:', authData)
        
        if (authData.authResult) {
          console.log('✅ Authentication verified, redirecting...')
          setSuccess('Authentication verified! Redirecting to dashboard...')
          
          // Use window.location.href for a clean redirect
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 500)
        } else {
          console.error('❌ Authentication verification failed')
          setError('Login succeeded but session verification failed. Please try again.')
        }
      } catch (authError) {
        console.error('❌ Auth verification error:', authError)
        // Fallback: try to redirect anyway
        console.log('🔄 Attempting redirect despite verification error...')
        window.location.href = '/dashboard'
      }
        
    } catch (error) {
      console.error('💥 Login error:', error)
      setError('An error occurred. Please try again.')
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              <p className="mb-2">{success}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    console.log('🔄 Manual dashboard redirect')
                    window.location.href = '/dashboard'
                  }}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => {
                    console.log('🧪 Testing auth status')
                    fetch('/api/test-auth').then(r => r.json()).then(data => {
                      console.log('Auth test result:', data)
                      alert('Auth test: ' + JSON.stringify(data, null, 2))
                    })
                  }}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  Test Auth
                </button>
                <button 
                  onClick={() => window.location.href = '/test-redirect'}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Test Page
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}