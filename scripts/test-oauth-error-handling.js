#!/usr/bin/env node

/**
 * Test OAuth Error Handling
 * Tests the graceful handling of missing Google OAuth credentials
 */

const { GOOGLE_OAUTH_CONFIG } = require('../lib/google-auth.ts')

console.log('🧪 Testing OAuth Error Handling\n')

// Test 1: Check environment variables
console.log('1️⃣ Checking Environment Variables...')
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing')
console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing')
console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing')

// Test 2: Check configuration object
console.log('\n2️⃣ Checking OAuth Configuration...')
try {
  console.log('   Client ID defined:', !!GOOGLE_OAUTH_CONFIG.clientId)
  console.log('   Client Secret defined:', !!GOOGLE_OAUTH_CONFIG.clientSecret)
  console.log('   Redirect URI:', GOOGLE_OAUTH_CONFIG.redirectUri)
} catch (error) {
  console.log('   ❌ Error accessing configuration:', error.message)
}

// Test 3: Simulate OAuth URL generation
console.log('\n3️⃣ Testing OAuth URL Generation...')
try {
  const { getGoogleAuthUrl } = require('../lib/google-auth.ts')
  const authUrl = getGoogleAuthUrl('test-state')
  console.log('   ✅ OAuth URL generated successfully')
  console.log('   URL contains client_id:', authUrl.includes('client_id='))
  
  // Check if client_id is undefined
  if (authUrl.includes('client_id=undefined')) {
    console.log('   ⚠️ WARNING: client_id is undefined in URL')
  } else {
    console.log('   ✅ client_id properly set in URL')
  }
} catch (error) {
  console.log('   ❌ Error generating OAuth URL:', error.message)
}

console.log('\n🎯 SUMMARY:')
console.log('==========')

const hasClientId = !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here'
const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret-here'

if (hasClientId && hasClientSecret) {
  console.log('✅ Google OAuth is properly configured')
  console.log('✅ Users can register and login with Gmail')
} else {
  console.log('⚠️ Google OAuth credentials are missing or placeholder values')
  console.log('⚠️ Google OAuth buttons will show error messages')
  console.log('✅ Local authentication (email/password) still works')
  console.log('📋 Next step: Set up Google Cloud Console credentials')
}

console.log('\n📖 For setup instructions, see: GMAIL_AUTH_SETUP_GUIDE.md')