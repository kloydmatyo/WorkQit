import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'
import Job from '@/models/Job'
import User from '@/models/User'
import Notification from '@/models/Notification'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || !['job_seeker', 'student'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Only job seekers and students can apply for jobs' },
        { status: 401 }
      )
    }

    const jobId = params.id
    
    let coverLetter
    try {
      const body = await request.json()
      coverLetter = body.coverLetter
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      coverLetter = undefined
    }

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

    // Get user's resume information
    const applicant = await User.findById(user.userId).select('resume')
    let resumeData = null
    
    if (applicant?.resume) {
      resumeData = {
        filename: applicant.resume.filename,
        cloudinaryUrl: applicant.resume.cloudinaryUrl,
        cloudinaryPublicId: applicant.resume.cloudinaryPublicId,
        uploadedAt: applicant.resume.uploadedAt,
      }
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: user.userId,
      coverLetter,
      resume: resumeData,
      status: 'pending'
    })

    // Add applicant to job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $addToSet: { applicants: user.userId }
    })

    // Get applicant details for notification
    const applicantDetails = await User.findById(user.userId).select('firstName lastName')

    // Create notification for employer
    try {
      await Notification.create({
        recipient: job.employerId,
        sender: user.userId,
        type: 'comment',
        message: `📋 New application received from ${applicantDetails?.firstName} ${applicantDetails?.lastName} for ${job.title}`,
        read: false,
      })
      console.log('Notification sent to employer:', job.employerId)
    } catch (notifError) {
      console.error('Error creating employer notification:', notifError)
      // Don't fail the application if notification fails
    }

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