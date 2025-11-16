import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'

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

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const applicantId = searchParams.get('applicantId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    // Handle applicantId = 'me' to mean current user
    if (applicantId === 'me') {
      query.applicantId = tokenPayload.userId
    } else if (applicantId) {
      query.applicantId = applicantId
    }

    if (jobId) {
      query.jobId = jobId
    }

    if (status) {
      query.status = status
    }

    // For job seekers, only show their own applications
    if (tokenPayload.role === 'job_seeker' && !query.applicantId) {
      query.applicantId = tokenPayload.userId
    }

    // For employers, only show applications for their jobs
    if (tokenPayload.role === 'employer' && !jobId) {
      const employerJobs = await Job.find({ employerId: tokenPayload.userId }).select('_id')
      const jobIds = employerJobs.map((job: any) => job._id)
      query.jobId = { $in: jobIds }
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('jobId', 'title company location type remote')
        .populate('applicantId', 'firstName lastName email profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(query)
    ])

    return NextResponse.json({
      applications: applications.map((app: any) => ({
        id: app._id.toString(),
        jobId: app.jobId?._id?.toString(),
        jobTitle: app.jobId?.title,
        company: app.jobId?.company,
        location: app.jobId?.location,
        jobType: app.jobId?.type,
        remote: app.jobId?.remote,
        applicantId: app.applicantId?._id?.toString(),
        applicantName: app.applicantId ? `${app.applicantId.firstName} ${app.applicantId.lastName}` : 'Unknown',
        applicantEmail: app.applicantId?.email,
        status: app.status,
        coverLetter: app.coverLetter,
        resume: app.resume,
        feedbacks: app.feedbacks,
        appliedDate: app.createdAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
