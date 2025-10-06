import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import { generateVerificationToken, getVerificationTokenExpiry, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { email, password, firstName, lastName, role } = await request.json()

    // Validate input
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      } else {
        // User exists but email not verified - resend verification
        const verificationToken = generateVerificationToken()
        const verificationExpires = getVerificationTokenExpiry()

        await User.findByIdAndUpdate(existingUser._id, {
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
        })

        await sendVerificationEmail(email, verificationToken, firstName)

        return NextResponse.json(
          { 
            message: 'Account exists but email not verified. Verification email resent.',
            requiresVerification: true 
          },
          { status: 200 }
        )
      }
    }

    // Validate password for local registration
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = generateVerificationToken()
    const verificationExpires = getVerificationTokenExpiry()

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'job_seeker',
      authProvider: 'local',
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken, firstName)

    // Remove sensitive data from response
    const { password: _, emailVerificationToken: __, ...userWithoutSensitiveData } = user.toObject()

    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: userWithoutSensitiveData,
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}