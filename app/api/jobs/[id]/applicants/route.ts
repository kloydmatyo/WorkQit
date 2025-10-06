import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized - employer access required' },
        { status: 401 }
      )
    }

    const jobId = params.id

    // Verify that the job belongs to the current employer
    const job = await Job.findById(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    if (job.employerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - not your job' },
        { status: 403 }
      )
    }

    // Get all applications for this job with applicant details
    const applications = await Application.find({ jobId })
      .populate({
        path: 'applicantId',
        select: 'firstName lastName email profile.bio profile.skills profile.experience profile.location'
      })
      .sort({ createdAt: -1 })

    // Format the response
    const formattedApplicants = applications.map(app => ({
      applicationId: app._id,
      applicant: {
        id: app.applicantId._id,
        firstName: app.applicantId.firstName,
        lastName: app.applicantId.lastName,
        email: app.applicantId.email,
        bio: app.applicantId.profile?.bio || '',
        skills: app.applicantId.profile?.skills || [],
        experience: app.applicantId.profile?.experience || '',
        location: app.applicantId.profile?.location || ''
      },
      application: {
        status: app.status,
        coverLetter: app.coverLetter,
        appliedDate: app.createdAt,
        feedbacks: app.feedbacks || []
      }
    }))

    return NextResponse.json({
      job: {
        id: job._id,
        title: job.title,
        company: job.company
      },
      applicants: formattedApplicants,
      totalApplicants: formattedApplicants.length
    })

  } catch (error) {
    console.error('Job applicants fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized - employer access required' },
        { status: 401 }
      )
    }

    const jobId = params.id
    const { applicationId, status, feedback } = await request.json()

    // Verify that the job belongs to the current employer
    const job = await Job.findById(jobId)
    if (!job || job.employerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update the application status
    const updateData: any = { status }
    
    // Add feedback if provided
    if (feedback) {
      updateData.$push = {
        feedbacks: {
          ...feedback,
          employerId: user.userId,
          createdAt: new Date()
        }
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    )

    if (!updatedApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Application status updated successfully',
      application: {
        id: updatedApplication._id,
        status: updatedApplication.status
      }
    })

  } catch (error) {
    console.error('Application status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}