import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test auth endpoint called')
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value
    console.log('🍪 Token present:', !!token)
    
    if (!token) {
      return NextResponse.json({
        authResult: false,
        message: 'No token found',
        timestamp: new Date().toISOString()
      })
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({
        authResult: false,
        message: 'JWT_SECRET not configured',
        timestamp: new Date().toISOString()
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    console.log('✅ Token verified for user:', decoded.email)
    
    return NextResponse.json({
      authResult: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      message: 'Authentication successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Auth test error:', error)
    return NextResponse.json({
      authResult: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}