import { OAuth2Client } from 'google-auth-library'

// Google OAuth configuration and utilities
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`, // Fixed the path
  scope: 'openid email profile',
}

const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;

// Create OAuth2 client with the exact redirectUri
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

// Generate Google OAuth URL
export function getGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId!,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent',
    ...(state && { state }),
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

// Exchange authorization code for access token
export async function exchangeCodeForTokens(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId!,
      client_secret: GOOGLE_OAUTH_CONFIG.clientSecret!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to exchange code for tokens: ${errorText}`)
  }

  return response.json()
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get user info from Google')
  }

  return response.json()
}

// Verify Google ID token
export async function verifyGoogleIdToken(idToken: string) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
  
  if (!response.ok) {
    throw new Error('Invalid Google ID token')
  }

  const tokenInfo = await response.json()
  
  // Verify the token is for our app
  if (tokenInfo.aud !== GOOGLE_OAUTH_CONFIG.clientId) {
    throw new Error('Token audience mismatch')
  }

  return tokenInfo
}