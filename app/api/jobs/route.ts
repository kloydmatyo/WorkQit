import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Job from '@/models/Job'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const remote = searchParams.get('remote')
    const skills = searchParams.get('skills')
    const employer = searchParams.get('employer')

    // Build filter object
    const filter: any = { status: 'active' }
    
    // If employer=true, filter by current user's jobs
    if (employer === 'true') {
      const user = await verifyToken(request)
      if (!user || user.role !== 'employer') {
        return NextResponse.json(
          { error: 'Unauthorized - employer access required' },
          { status: 401 }
        )
      }
      filter.employerId = user.userId
    }
    
    if (type) filter.type = type
    if (location) filter.location = { $regex: location, $options: 'i' }
    if (remote === 'true') filter.remote = true
    if (remote === 'false') filter.remote = false
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim())
      filter.skills = { $in: skillsArray }
    }

    const skip = (page - 1) * limit

    // Fetch jobs with population in one query
    const jobs = await Job.find(filter)
      .populate('employerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Job.countDocuments(filter)

    // Add applicant count for employer view
    const jobsWithApplicantCount = jobs.map(job => {
      if (employer === 'true') {
        return {
          ...job,
          applicantCount: job.applicants ? job.applicants.length : 0
        }
      }
      return job
    })

    return NextResponse.json({
      jobs: jobsWithApplicantCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Jobs fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const user = await verifyToken(request)
    if (!user || user.role !== 'employer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const jobData = await request.json()
    
    const job = await Job.create({
      ...jobData,
      employerId: user.userId,
    })

    return NextResponse.json(
      { message: 'Job created successfully', job },
      { status: 201 }
    )
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}