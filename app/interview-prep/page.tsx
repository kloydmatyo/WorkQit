'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { 
  Sparkles, 
  MessageCircle, 
  Lightbulb, 
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Video,
  FileText
} from 'lucide-react'

interface InterviewTip {
  category: string
  tips: string[]
}

interface AIResponse {
  tips: InterviewTip[]
  commonQuestions: string[]
  preparationSteps: string[]
}

export default function InterviewPrepPage() {
  const [jobRole, setJobRole] = useState('')
  const [experience, setExperience] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [error, setError] = useState('')
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  const handleGenerateTips = async () => {
    if (!jobRole) {
      setError('Please enter a job role')
      return
    }

    setLoading(true)
    setError('')
    setAiResponse(null)

    try {
      console.log('Generating tips for:', { jobRole, experience, industry })
      
      const response = await fetch('/api/ai/interview-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          jobRole,
          experience,
          industry,
        }),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Received data:', data)
        setAiResponse(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        setError(errorData.error || 'Failed to generate tips. Please try again.')
      }
    } catch (err) {
      console.error('Error generating tips:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generalTips = [
    {
      icon: Target,
      title: 'Research the Company',
      description: 'Study the company\'s mission, values, recent news, and culture before the interview.',
      color: 'blue'
    },
    {
      icon: MessageCircle,
      title: 'Practice STAR Method',
      description: 'Structure your answers using Situation, Task, Action, Result for behavioral questions.',
      color: 'purple'
    },
    {
      icon: CheckCircle,
      title: 'Prepare Questions',
      description: 'Have thoughtful questions ready about the role, team, and company growth.',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Show Enthusiasm',
      description: 'Express genuine interest in the role and demonstrate your passion for the field.',
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-10 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                <Sparkles className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-[floatUp_0.85s_ease-out] mb-2">
                  AI Interview Preparation
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Get personalized interview tips powered by AI
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* AI Tips Generator */}
        <div className="card relative overflow-hidden group/generator mb-8 animate-[floatUp_0.6s_ease-out_0.1s_both]" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/generator:opacity-100 transition-opacity duration-500"></div>
          <div className="relative mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-inner shadow-purple-700/20">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="feature-heading text-2xl font-bold">
              Generate Personalized Tips
            </h2>
          </div>

          <div className="relative space-y-4">
            <div>
              <label className="auth-label mb-3 block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                Job Role *
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                className="glass-input w-full px-5 py-3.5 text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="auth-label mb-3 block text-sm font-bold uppercase tracking-[0.15em] text-primary-600">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="glass-input w-full px-5 py-3.5 text-base appearance-none bg-white/70 cursor-pointer"
                >
                  <option value="">Select level</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="lead">Lead/Manager</option>
                </select>
              </div>

              <div>
                <label className="auth-label mb-3 block text-sm font-bold uppercase tracking-[0.15em] text-primary-600">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Technology, Finance, Healthcare"
                  className="glass-input w-full px-5 py-3.5 text-base"
                />
              </div>
            </div>

            {error && (
              <div className="glass-alert glass-alert-error flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerateTips}
              disabled={loading || !jobRole}
              className="btn-primary w-full px-8 py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating Tips...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                  Generate AI Tips
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Generated Tips */}
        {aiResponse && (
          <div className="mb-8 space-y-6">
            {/* Tips by Category */}
            {aiResponse.tips && Array.isArray(aiResponse.tips) && aiResponse.tips.map((tipCategory, idx) => (
              <div key={idx} className="card relative overflow-hidden group/tip hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 animate-[floatUp_0.6s_ease-out_both]" style={{ '--float-delay': `${0.2 + idx * 0.05}s` } as CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-900 group-hover/tip:text-primary-600 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                      <Lightbulb className="h-5 w-5 text-primary-600" />
                    </div>
                    {tipCategory.category}
                  </h3>
                  <ul className="space-y-4">
                    {tipCategory.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-3 p-3 rounded-xl border border-white/40 bg-white/60 backdrop-blur hover:border-primary-500/40 hover:shadow-lg transition-all duration-300">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-base text-secondary-700 leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Common Questions */}
            {aiResponse.commonQuestions && Array.isArray(aiResponse.commonQuestions) && aiResponse.commonQuestions.length > 0 && (
              <div className="card relative overflow-hidden group/questions hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 animate-[floatUp_0.6s_ease-out_both]" style={{ '--float-delay': `${0.3 + (aiResponse.tips?.length || 0) * 0.05}s` } as CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover/questions:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-900 group-hover/questions:text-purple-600 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    Common Interview Questions
                  </h3>
                  <ul className="space-y-4">
                    {aiResponse.commonQuestions.map((question, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-white/40 bg-white/60 backdrop-blur hover:border-purple-500/40 hover:shadow-lg transition-all duration-300">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-sm font-bold text-purple-600">
                          {idx + 1}
                        </span>
                        <span className="text-base text-secondary-700 leading-relaxed">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Preparation Steps */}
            {aiResponse.preparationSteps && Array.isArray(aiResponse.preparationSteps) && aiResponse.preparationSteps.length > 0 && (
              <div className="card relative overflow-hidden group/prep hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 animate-[floatUp_0.6s_ease-out_both]" style={{ '--float-delay': `${0.4 + (aiResponse.tips?.length || 0) * 0.05}s` } as CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover/prep:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-900 group-hover/prep:text-blue-600 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    Preparation Checklist
                  </h3>
                  <ul className="space-y-4">
                    {aiResponse.preparationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-white/40 bg-white/60 backdrop-blur hover:border-blue-500/40 hover:shadow-lg transition-all duration-300">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/40 text-sm font-bold text-blue-600">
                          {idx + 1}
                        </div>
                        <span className="text-base text-secondary-700 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* General Tips */}
        <div className="mb-8">
          <h2 className="feature-heading text-3xl font-bold mb-6 animate-[floatUp_0.6s_ease-out_0.5s_both]" style={{ '--float-delay': '0.5s' } as CSSProperties}>
            Universal Interview Tips
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {generalTips.map((tip, idx) => (
              <div key={idx} className="card relative overflow-hidden group/general hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-[floatUp_0.6s_ease-out_both]" style={{ '--float-delay': `${0.6 + idx * 0.05}s` } as CSSProperties}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/general:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl border shadow-inner transition-all duration-300 group-hover/general:scale-110 ${getColorClasses(tip.color)}`}>
                      <tip.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover/general:text-primary-600 transition-colors">{tip.title}</h3>
                  </div>
                  <p className="text-base text-secondary-700 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="card relative overflow-hidden group/resources hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 animate-[floatUp_0.6s_ease-out_0.8s_both]" style={{ '--float-delay': '0.8s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/resources:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-2xl font-bold mb-6">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <a
                href="/webinars"
                className="feature-card flex items-center gap-4 p-6 group/link hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-inner shadow-blue-700/20 group-hover/link:scale-110 transition-transform duration-300">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover/link:text-blue-600 transition-colors">Webinars</h3>
                  <p className="text-sm text-secondary-600">Join live sessions</p>
                </div>
              </a>

              <a
                href="/resources"
                className="feature-card flex items-center gap-4 p-6 group/link hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 shadow-inner shadow-green-700/20 group-hover/link:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover/link:text-green-600 transition-colors">Resources</h3>
                  <p className="text-sm text-secondary-600">Study materials</p>
                </div>
              </a>

              <a
                href="/mentors"
                className="feature-card flex items-center gap-4 p-6 group/link hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-inner shadow-purple-700/20 group-hover/link:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover/link:text-purple-600 transition-colors">Find Mentors</h3>
                  <p className="text-sm text-secondary-600">Get guidance</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
