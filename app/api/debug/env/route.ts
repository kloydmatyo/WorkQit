import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }

  console.log('🔍 Environment check:', envCheck)

  return NextResponse.json({
    message: 'Environment check',
    env: envCheck,
    // Don't expose actual values, just check if they exist
    details: {
      mongoUri: process.env.MONGODB_URI ? 'Set (length: ' + process.env.MONGODB_URI.length + ')' : 'Not set',
      jwtSecret: process.env.JWT_SECRET ? 'Set (length: ' + process.env.JWT_SECRET.length + ')' : 'Not set'
    }
  })
}