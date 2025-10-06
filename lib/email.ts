import crypto from 'crypto'

// Email verification token generation
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Email verification token expiry (24 hours)
export function getVerificationTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
}

// Send verification email (using a simple approach for now)
export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`
  
  // In a production environment, you would use a service like SendGrid, Nodemailer, or AWS SES
  // For now, we'll log the verification URL and return success
  console.log(`
    📧 Email Verification Required
    ==============================
    To: ${email}
    Subject: Verify your WorkQit account
    
    Hi ${firstName},
    
    Thank you for registering with WorkQit! Please verify your email address by clicking the link below:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account with WorkQit, please ignore this email.
    
    Best regards,
    The WorkQit Team
  `)
  
  // Return success for now - in production, this would actually send the email
  return { success: true, message: 'Verification email sent' }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, firstName: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`
  
  console.log(`
    🔐 Password Reset Request
    =========================
    To: ${email}
    Subject: Reset your WorkQit password
    
    Hi ${firstName},
    
    You requested to reset your password for your WorkQit account. Click the link below to reset your password:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, please ignore this email.
    
    Best regards,
    The WorkQit Team
  `)
  
  return { success: true, message: 'Password reset email sent' }
}