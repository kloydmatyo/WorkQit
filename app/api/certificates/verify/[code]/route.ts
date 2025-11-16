import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import AssessmentAttempt from '@/models/AssessmentAttempt'

export async function GET(
  request: NextRequest,
  context: { params: { code: string } }
) {
  try {
    await dbConnect()

    const { code } = context.params

    if (!code) {
      return NextResponse.json(
        { error: 'Certificate code is required' },
        { status: 400 }
      )
    }

    // Find the certificate by code
    const certificate = await AssessmentAttempt.findOne({
      certificateCode: code,
      passed: true // Only show passed assessments
    })
      .populate('userId', 'firstName lastName email')
      .populate('assessmentId', 'title category difficulty')
      .lean()

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found or invalid' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      certificate
    })
  } catch (error) {
    console.error('Certificate verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    )
  }
}
