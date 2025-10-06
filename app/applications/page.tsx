'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Briefcase, Calendar, MapPin, Building, ExternalLink, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Application {
  id: string
  jobTitle: string
  company: string
  status: string
  appliedDate: string
  jobType?: string
  location?: string
  remote?: boolean
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/applications', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        setError('Failed to load applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'reviewed':
        return <Eye className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Under Review'
      case 'reviewed':
        return 'Reviewed'
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Not Selected'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">
          Track the status of your job applications and stay updated on your progress.
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">
            Start applying to jobs to see your applications here.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Browse Jobs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.jobTitle}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="font-medium">{application.company}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {application.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {application.location}
                        {application.remote && ' (Remote)'}
                      </div>
                    )}
                    
                    {application.jobType && (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {application.jobType.replace('_', ' ').toUpperCase()}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{getStatusText(application.status)}</span>
                  </span>
                </div>
              </div>

              {/* Application Timeline */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {getStatusText(application.status)}
                    {application.status === 'pending' && (
                      <span className="ml-2 text-blue-600">• Waiting for employer review</span>
                    )}
                    {application.status === 'reviewed' && (
                      <span className="ml-2 text-blue-600">• Under consideration</span>
                    )}
                    {application.status === 'accepted' && (
                      <span className="ml-2 text-green-600">• Congratulations! You got the job</span>
                    )}
                    {application.status === 'rejected' && (
                      <span className="ml-2 text-gray-600">• Keep applying to other opportunities</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {applications.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Browse More Jobs
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Update Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}