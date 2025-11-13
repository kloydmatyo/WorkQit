import { NextRequest, NextResponse } from 'next/server'

// This route exists to handle the Google OAuth callback at the expected URL
// It redirects to our actual callback handler
export async function GET(request: NextRequest) {
  // Get the current URL with all parameters
  const url = new URL(request.url)
  
  // Create the redirect URL to our actual callback handler
  const redirectUrl = new URL('/api/auth/google/callback', url.origin)
  
  // Copy all search parameters to the redirect URL
  url.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })
  
  // Redirect to our actual callback handler
  return NextResponse.redirect(redirectUrl)
}