import { Award, CheckCircle, XCircle, Calendar, Shield, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import dbConnect from '@/lib/mongoose'
import AssessmentAttempt from '@/models/AssessmentAttempt'

interface Certificate {
  _id: string
  userId: {
    firstName: string
    lastName: string
    email: string
  }
  assessmentId: {
    title: string
    category: string
    difficulty: string
  }
  score: number
  passingScore: number
  passed: boolean
  completedAt: string
  certificateCode: string
  verificationUrl: string
}

async function getCertificate(code: string): Promise<Certificate | null> {
  try {
    await dbConnect()
    
    const certificate = await AssessmentAttempt.findOne({
      certificateCode: code,
      passed: true
    })
      .populate('userId', 'firstName lastName email')
      .populate('assessmentId', 'title category difficulty')
      .lean()

    if (!certificate) {
      return null
    }

    return JSON.parse(JSON.stringify(certificate))
  } catch (error) {
    console.error('Error fetching certificate:', error)
    return null
  }
}

export default async function VerifyCertificatePage({
  params
}: {
  params: { code: string }
}) {
  const certificate = await getCertificate(params.code)
  const error = !certificate

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Certificate</h1>
            <p className="text-gray-600">This certificate could not be verified or does not exist.</p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Verification Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-100 border-2 border-green-500 rounded-full mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-green-800 font-bold text-lg">Certificate Verified</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Valid Certificate</h1>
          <p className="text-gray-600">This certificate has been verified and is authentic</p>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-primary-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white text-center">
            <Award className="h-20 w-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Certificate of Achievement</h2>
            <p className="text-primary-100">WorkQit Skills Assessment Platform</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Recipient */}
            <div className="text-center pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-2">This certifies that</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {certificate.userId.firstName} {certificate.userId.lastName}
              </h3>
              <p className="text-gray-600">{certificate.userId.email}</p>
            </div>

            {/* Assessment Details */}
            <div className="text-center pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-2">has successfully completed</p>
              <h4 className="text-2xl font-bold text-primary-600 mb-2">
                {certificate.assessmentId.title}
              </h4>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {certificate.assessmentId.category}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold capitalize">
                  {certificate.assessmentId.difficulty}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-center pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-2">with a score of</p>
              <div className="inline-block">
                <div className="text-5xl font-bold text-primary-600 mb-1">
                  {certificate.score}%
                </div>
                <p className="text-sm text-gray-600">
                  Passing Score: {certificate.passingScore}%
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Completed On</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Certificate Code</p>
                  <p className="font-mono font-semibold text-gray-900 text-sm">
                    {certificate.certificateCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-green-900 mb-2">Verification Details</h5>
                  <p className="text-sm text-green-800 mb-3">
                    This certificate has been verified as authentic and was issued by WorkQit Skills Assessment Platform.
                    The certificate holder has successfully demonstrated proficiency in the assessed skills.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <ExternalLink className="h-4 w-4" />
                    <span>Verified on: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">WorkQit Skills Assessment Platform</p>
                <p>Empowering careers through verified skills</p>
              </div>
              <Link
                href="/"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Visit WorkQit
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This certificate can be verified at any time using the certificate code above.
          </p>
          <p className="mt-2">
            For questions about this certificate, please contact{' '}
            <a href="mailto:support@workqit.com" className="text-primary-600 hover:underline">
              support@workqit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
