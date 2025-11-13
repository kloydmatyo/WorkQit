import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Import required modules for database operations
    const dbConnect = require('@/lib/mongoose').default
    const Application = require('@/models/Application').default
    const Job = require('@/models/Job').default

    await dbConnect()

    // Get user's recent applications to generate relevant notifications
    const recentApplications = await Application.find({ applicantId: user.userId })
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 })
      .limit(5)

    const notifications = []

    // Generate notifications based on application status
    recentApplications.forEach((app: any, index: number) => {
      if (app.status === 'reviewed') {
        notifications.push({
          id: `app_${app._id}_reviewed`,
          message: `Your application for ${app.jobId?.title || 'a position'} at ${app.jobId?.company || 'a company'} is being reviewed`,
          createdAt: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          type: 'application_update'
        })
      } else if (app.status === 'accepted') {
        notifications.push({
          id: `app_${app._id}_accepted`,
          message: `Congratulations! Your application for ${app.jobId?.title || 'a position'} at ${app.jobId?.company || 'a company'} has been accepted`,
          createdAt: new Date(Date.now() - (index + 1) * 1 * 60 * 60 * 1000).toISOString(),
          read: false,
          type: 'application_accepted'
        })
      } else if (app.status === 'rejected') {
        notifications.push({
          id: `app_${app._id}_rejected`,
          message: `Your application for ${app.jobId?.title || 'a position'} at ${app.jobId?.company || 'a company'} was not selected. Keep applying!`,
          createdAt: new Date(Date.now() - (index + 1) * 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          type: 'application_rejected'
        })
      }
    })

    // Add some general notifications if there are few application-based ones
    if (notifications.length < 3) {
      notifications.push(
        {
          id: 'job_match_1',
          message: 'New job matches found based on your skills and preferences',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          type: 'job_match'
        },
        {
          id: 'profile_tip',
          message: 'Complete your profile to get better job recommendations',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          type: 'profile_tip'
        }
      )
    }

    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      notifications: notifications.slice(0, 10), // Limit to 10 most recent
      unreadCount: notifications.filter(n => !n.read).length
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}