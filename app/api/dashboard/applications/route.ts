import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import Application from '@/models/Application'

export async function GET(request: NextRequest) {
  try {
    console.log('[Dashboard Applications] Starting request...')
    const tokenPayload = await verifyToken(request)
    
    if (!tokenPayload) {
      console.log('[Dashboard Applications] No token payload - unauthorized')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Dashboard Applications] User authenticated:', tokenPayload.userId)
    await dbConnect()

    // Fetch recent applications for the user
    let applications = await Application.find({ 
      applicantId: tokenPayload.userId 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    console.log('[Dashboard Applications] Found applications:', applications.length)

    // Manually populate jobId to handle missing references
    const formattedApplications = []
    for (const app of applications) {
      try {
        let jobData: any = null
        if ((app as any).jobId) {
          const Job = (await import('@/models/Job')).default
          jobData = await Job.findById((app as any).jobId).select('title company location type remote').lean()
        }

        formattedApplications.push({
          id: (app as any)._id.toString(),
          jobTitle: jobData?.title || 'Position No Longer Available',
          company: jobData?.company || 'Unknown Company',
          location: jobData?.location,
          jobType: jobData?.type,
          remote: jobData?.remote,
          status: (app as any).status,
          appliedDate: (app as any).createdAt,
        })
      } catch (populateError) {
        console.error('[Dashboard Applications] Error populating job:', populateError)
        // Still include the application even if job data is missing
        formattedApplications.push({
          id: (app as any)._id.toString(),
          jobTitle: 'Position No Longer Available',
          company: 'Unknown Company',
          location: undefined,
          jobType: undefined,
          remote: undefined,
          status: (app as any).status,
          appliedDate: (app as any).createdAt,
        })
      }
    }

    console.log('[Dashboard Applications] Formatted applications:', formattedApplications.length)

    return NextResponse.json({
      applications: formattedApplications,
    })
  } catch (error) {
    console.error('[Dashboard Applications] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
