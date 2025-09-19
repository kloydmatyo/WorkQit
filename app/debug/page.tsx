'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<{
    cookies: string
    userAgent: string
    timestamp: string
    apiTest: any
  }>({
    cookies: '',
    userAgent: '',
    timestamp: '',
    apiTest: null
  })

  useEffect(() => {
    // Get client-side debug info
    setDebugInfo({
      cookies: document.cookie,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      apiTest: null
    })

    // Test API connectivity
    testAPI()
  }, [])

  const testAPI = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      setDebugInfo(prev => ({
        ...prev,
        apiTest: {
          status: response.status,
          data: data,
          headers: Object.fromEntries(response.headers.entries())
        }
      }))
    } catch (error) {
      setDebugInfo(prev => ({
        ...prev,
        apiTest: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    }
  }

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@workqit.com',
          password: 'password123'
        }),
      })

      const data = await response.json()
      console.log('Login test result:', { status: response.status, data })
      alert(`Login test: ${response.status} - ${JSON.stringify(data)}`)
    } catch (error) {
      console.error('Login test error:', error)
      alert(`Login test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="space-y-2">
            <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
            <p><strong>Cookies:</strong> {debugInfo.cookies || 'No cookies found'}</p>
            <p><strong>User Agent:</strong> {debugInfo.userAgent}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          {debugInfo.apiTest ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.apiTest, null, 2)}
            </pre>
          ) : (
            <p>Loading API test...</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={testLogin}
              className="btn-primary"
            >
              Test Login
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Refresh Page
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Test Credentials</h3>
          <p className="text-yellow-700">
            <strong>Email:</strong> test@workqit.com<br/>
            <strong>Password:</strong> password123
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Run <code>npm run create:test-user</code> to create this test user if it doesn't exist.
          </p>
        </div>
      </div>
    </div>
  )
}