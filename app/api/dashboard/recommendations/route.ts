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

    // Get user profile to understand their skills and preferences
    const userProfile = await User.findById(user.userId)
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get jobs user has already applied to
    const appliedJobs = await Application.find({ applicantId: user.userId })
      .select('jobId')
    const appliedJobIds = appliedJobs.map(app => app.jobId)

    // Build recommendation query based on user profile
    const recommendationQuery: any = {
      status: 'active',
      _id: { $nin: appliedJobIds } // Exclude already applied jobs
    }

    // If user has skills, match jobs that require those skills
    if (userProfile.profile?.skills && userProfile.profile.skills.length > 0) {
      recommendationQuery.skills = { $in: userProfile.profile.skills }
    }

    // If user has location preference, prioritize local jobs
    if (userProfile.profile?.location) {
      // This could be enhanced with geolocation matching
      recommendationQuery.$or = [
        { location: { $regex: userProfile.profile.location, $options: 'i' } },
        { remote: true }
      ]
    }

    // If user prefers remote work
    if (userProfile.profile?.remote) {
      recommendationQuery.remote = true
    }

    // Get recommended jobs
    const recommendedJobs = await Job.find(recommendationQuery)
      .populate('employerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)

    const formattedRecommendations = recommendedJobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote,
      type: job.type,
      salary: job.salary,
      skills: job.skills,
      createdAt: job.createdAt
    }))

    return NextResponse.json({
      recommendations: formattedRecommendations,
      total: formattedRecommendations.length
    })

  } catch (error) {
    console.error('Dashboard recommendations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}