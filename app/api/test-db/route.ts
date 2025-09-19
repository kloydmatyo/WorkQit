import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('🔄 Testing database connections...')

    // Test 1: MongoDB native client
    const client = await clientPromise
    const db = client.db('workqit')
    
    // Test basic operation
    const collections = await db.listCollections().toArray()
    console.log('✅ MongoDB native client connected')
    console.log('📂 Collections:', collections.map(c => c.name))

    // Test 2: Mongoose connection
    await dbConnect()
    console.log('✅ Mongoose connected')

    // Test 3: Database stats
    const stats = await db.stats()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      details: {
        database: stats.db,
        collections: collections.map(c => c.name),
        collectionsCount: stats.collections,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Database connection failed:', error)
    
    let errorType = 'Unknown error'
    if (error.message?.includes('authentication failed')) {
      errorType = 'Authentication failed - check username/password'
    } else if (error.message?.includes('network')) {
      errorType = 'Network error - check internet connection and IP whitelist'
    } else if (error.message?.includes('timeout')) {
      errorType = 'Connection timeout - check network and MongoDB Atlas status'
    }

    return NextResponse.json({
      success: false,
      error: error.message,
      errorType,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}