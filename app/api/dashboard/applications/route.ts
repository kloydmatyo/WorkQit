import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'

export async function GET(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request)
    
    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Fetch recent applications for the user
    const applications = await Application.find({ 
      applicantId: tokenPayload.userId 
    })
      .populate('jobId', 'title company location type remote')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    return NextResponse.json({
      applications: applications.map((app: any) => ({
        id: app._id.toString(),
        jobTitle: app.jobId?.title || 'Unknown Position',
        company: app.jobId?.company || 'Unknown Company',
        location: app.jobId?.location,
        jobType: app.jobId?.type,
        remote: app.jobId?.remote,
        status: app.status,
        appliedDate: app.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching dashboard applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
