'use client'

/**
 * Job Details Page
 * Display detailed job information using atomic design components
 */

import React, { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { JobDetailsTemplate } from '@/components/templates'
import { Spinner } from '@/components/atoms'
import { EmptyState } from '@/components/molecules'
import { useJob } from '@/hooks/useJobs'
import { useApplicationStatus } from '@/hooks/useApplications'
import JobApplicationModal from '@/components/JobApplicationModal'

export default function JobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const jobId = params.id as string
  const shouldShowApply = searchParams.get('apply') === 'true'

  const { job, loading, error } = useJob(jobId)
  const { hasApplied, error: applicationError, refetch: refetchApplicationStatus } = useApplicationStatus(jobId, { enabled: false })

  const [showApplicationModal, setShowApplicationModal] = useState(false)

  useEffect(() => {
    if (shouldShowApply && !hasApplied) {
      setShowApplicationModal(true)
    }
  }, [shouldShowApply, hasApplied])

  const handleApply = () => {
    setShowApplicationModal(true)
  }

  const handleApplicationSuccess = () => {
    refetchApplicationStatus()
    router.push('/applications')
  }

  const handleBack = () => {
    router.push('/jobs')
  }

  // Show loading only while fetching job data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    console.error('Job details error:', error)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            title="Job Not Found"
            description={error || 'The job you are looking for does not exist.'}
            actionLabel="Browse Jobs"
            onAction={() => router.push('/jobs-browse')}
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            title="Job Not Found"
            description="The job you are looking for does not exist."
            actionLabel="Browse Jobs"
            onAction={() => router.push('/jobs-browse')}
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        jobId={jobId}
        jobTitle={job?.title || ''}
        company={job?.company || ''}
        onSuccess={handleApplicationSuccess}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobDetailsTemplate
            job={job}
            onApply={handleApply}
            onBack={handleBack}
            hasApplied={applicationError ? false : hasApplied}
          />
          {applicationError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Note: Unable to check application status. You may proceed to apply if you haven't already.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
