import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'
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

    // Get user's recent applications with job details
    const applications = await Application.find({ applicantId: user.userId })
      .populate({
        path: 'jobId',
        select: 'title company type location remote'
      })
      .sort({ createdAt: -1 })
      .limit(10)

    const formattedApplications = applications.map(app => ({
      id: app._id,
      jobTitle: app.jobId?.title || 'Job Title Not Available',
      company: app.jobId?.company || 'Company Not Available',
      status: app.status,
      appliedDate: app.createdAt,
      jobType: app.jobId?.type,
      location: app.jobId?.location,
      remote: app.jobId?.remote
    }))

    return NextResponse.json({
      applications: formattedApplications
    })

  } catch (error) {
    console.error('Dashboard applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}