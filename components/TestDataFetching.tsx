'use client'

import { useState } from 'react'
import { 
  useDashboardStats, 
  useDashboardApplicationsOverview, 
  useJobRecommendations,
  useJobs,
  useProfile 
} from '@/hooks'

export default function TestDataFetching() {
  const [testActive, setTestActive] = useState('')

  // Test dashboard hooks
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats()
  const { applications, loading: appsLoading, error: appsError } = useDashboardApplicationsOverview()
  const { recommendations, loading: recsLoading, error: recsError } = useJobRecommendations()
  
  // Test other hooks
  const { jobs, loading: jobsLoading, error: jobsError } = useJobs({ page: 1, limit: 5 })
  const { user, loading: userLoading, error: userError } = useProfile()

  const testResults = [
    {
      name: 'Dashboard Stats',
      loading: statsLoading,
      error: statsError,
      data: stats,
      success: !statsLoading && !statsError && stats
    },
    {
      name: 'Dashboard Applications',
      loading: appsLoading,
      error: appsError,
      data: applications,
      success: !appsLoading && !appsError && Array.isArray(applications)
    },
    {
      name: 'Job Recommendations',
      loading: recsLoading,
      error: recsError,
      data: recommendations,
      success: !recsLoading && !recsError && Array.isArray(recommendations)
    },
    {
      name: 'Jobs List',
      loading: jobsLoading,
      error: jobsError,
      data: jobs,
      success: !jobsLoading && !jobsError && Array.isArray(jobs)
    },
    {
      name: 'User Profile',
      loading: userLoading,
      error: userError,
      data: user,
      success: !userLoading && !userError && user
    }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Data Fetching Tests</h1>
      
      <div className="grid gap-4">
        {testResults.map((test, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 ${
              test.success ? 'border-green-500 bg-green-50' :
              test.error ? 'border-red-500 bg-red-50' :
              test.loading ? 'border-yellow-500 bg-yellow-50' :
              'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{test.name}</h3>
              <div className="flex gap-2">
                {test.loading && (
                  <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                    Loading...
                  </span>
                )}
                {test.success && (
                  <span className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded">
                    ✅ Success
                  </span>
                )}
                {test.error && (
                  <span className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded">
                    ❌ Error
                  </span>
                )}
              </div>
            </div>
            
            {test.error && (
              <p className="text-red-600 text-sm mb-2">
                Error: {test.error}
              </p>
            )}
            
            <button
              onClick={() => setTestActive(testActive === test.name ? '' : test.name)}
              className="text-sm text-blue-600 hover:underline"
            >
              {testActive === test.name ? 'Hide' : 'Show'} Data
            </button>
            
            {testActive === test.name && (
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(test.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}