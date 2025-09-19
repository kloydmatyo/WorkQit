import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'job_seeker') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const jobId = params.id
    const { coverLetter } = await request.json()

    // Check if job exists and is active
    const job = await Job.findById(jobId)
    if (!job || job.status !== 'active') {
      return NextResponse.json(
        { error: 'Job not found or not active' },
        { status: 404 }
      )
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: user.userId
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: user.userId,
      coverLetter,
      status: 'pending'
    })

    // Add applicant to job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { applicants: user.userId }
    })

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        application: {
          id: application._id,
          status: application.status,
          appliedDate: application.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Job application error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}