'use client'

import { useState, useEffect } from 'react'
import { Award, Download, Calendar, Trophy } from 'lucide-react'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates/my')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (certificate: any) => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.title} Certificate`,
        text: `I earned a certificate in ${certificate.title}!`,
        url: certificate.verificationUrl
      })
    } else {
      navigator.clipboard.writeText(certificate.verificationUrl)
      alert('Verification URL copied to clipboard!')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <p className="text-lg text-secondary-600 font-medium">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-orange-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 text-white shadow-xl shadow-yellow-500/40 group/icon flex-shrink-0">
                <Trophy className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-orange-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  My Certificates
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  View and share your earned certificates
                </p>
              </div>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
            <div className="relative py-20 text-center">
              <div className="feature-icon mx-auto mb-6 w-20 h-20">
                <Award className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Certificates Yet</h3>
              <p className="text-lg text-secondary-600 mb-8">
                Complete assessments to earn certificates and boost your profile
              </p>
              <a
                href="/assessments"
                className="relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <Trophy className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" />
                <span className="relative z-10">Browse Assessments</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div 
                key={cert._id} 
                className="card relative overflow-hidden group/cert hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_70%)] opacity-0 group-hover/cert:opacity-100 transition-opacity duration-700"></div>
                
                {/* Certificate Header */}
                <div className="relative bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 p-8 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4 group-hover/cert:scale-110 group-hover/cert:rotate-12 transition-all duration-300">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
                    <p className="text-yellow-100 text-base font-medium">Certificate of Completion</p>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="relative p-8">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${getDifficultyColor(cert.difficulty)}`}>
                      {cert.difficulty}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border border-blue-500/40 shadow-md">
                      {cert.category}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-base">
                      <span className="text-secondary-600 font-semibold">Score:</span>
                      <span className="font-bold text-gray-900 text-lg">{cert.score}%</span>
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <span className="text-secondary-600 font-semibold">Questions:</span>
                      <span className="font-bold text-gray-900 text-lg">
                        {cert.correctAnswers}/{cert.totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-secondary-600">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-semibold">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 mb-6 border border-gray-200/50">
                    <p className="text-sm text-secondary-600 mb-2 font-semibold">Certificate ID</p>
                    <p className="text-base font-mono font-bold text-gray-900 break-all">{cert.certificateId}</p>
                  </div>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-secondary-600 mb-3 font-semibold">Skills Validated:</p>
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200/50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-300/50 shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200/50 text-gray-700 rounded-lg text-sm font-semibold border border-gray-300/50 shadow-sm">
                            +{cert.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}


                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
