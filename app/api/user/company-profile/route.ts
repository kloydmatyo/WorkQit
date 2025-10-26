import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function PUT(request: NextRequest) {
  try {
    const tokenPayload = await verifyToken(request)
    
    if (!tokenPayload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { companyProfile } = await request.json()

    if (!companyProfile) {
      return NextResponse.json(
        { message: 'Company profile data is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Get current user
    const currentUser = await User.findById(tokenPayload.userId)
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if user is an employer
    if (currentUser.role !== 'employer') {
      return NextResponse.json({ message: 'Access denied. Only employers can update company profiles.' }, { status: 403 })
    }

    // Update the user's company profile
    const updatedUser = await User.findByIdAndUpdate(
      tokenPayload.userId,
      {
        $set: {
          companyProfile: {
            companyName: companyProfile.companyName,
            industry: companyProfile.industry,
            companySize: companyProfile.companySize,
            website: companyProfile.website,
            description: companyProfile.description,
            location: companyProfile.location,
            phone: companyProfile.phone,
            founded: companyProfile.founded,
            benefits: companyProfile.benefits || [],
            culture: companyProfile.culture,
            updatedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: 'Failed to update company profile' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Company profile updated successfully',
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        companyProfile: updatedUser.companyProfile,
        createdAt: updatedUser.createdAt
      }
    })
  } catch (error) {
    console.error('Error updating company profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}