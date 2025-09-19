import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Job from '@/models/Job'
import Application from '@/models/Application'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's applications
    const applications = await Application.find({ applicantId: user.userId })
    
    // Count applications by status
    const applicationStats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    }

    // Calculate interviews (accepted + reviewed applications)
    const interviews = applicationStats.accepted + applicationStats.reviewed

    // Calculate offers (accepted applications)
    const offers = applicationStats.accepted

    // Mock profile views for now (can be implemented with a separate tracking system)
    const profileViews = Math.floor(Math.random() * 100) + 20

    return NextResponse.json({
      applications: applicationStats.total,
      interviews,
      offers,
      profile_views: profileViews,
      detailed_stats: applicationStats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}