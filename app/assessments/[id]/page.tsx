'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Award, AlertCircle } from 'lucide-react'

export default function TakeAssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    fetchAssessment()
  }, [params.id])

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [started, timeLeft])

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${params.id}/take`)
      if (response.ok) {
        const data = await response.json()
        setAssessment(data.assessment)
        setTimeLeft(data.assessment.duration * 60)
      }
    } catch (error) {
      console.error('Failed to fetch assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    setStarted(true)
    setStartTime(Date.now())
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    setSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    try {
      const response = await fetch(`/api/assessments/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeSpent })
      })
      
      if (response.ok) {
        const data = await response.json()
        router.push(`/assessments/${params.id}/results?data=${encodeURIComponent(JSON.stringify(data.result))}`)
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      alert('Failed to submit assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Assessment not found</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="hero-gradient relative min-h-screen overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
          <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 animate-[floatUp_0.6s_ease-out]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8 md:p-12">
              {/* Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-xl flex-shrink-0">
                  <Award className="w-10 h-10 relative z-10" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary-500/50 to-secondary-500/50 blur-xl animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{assessment.title}</h1>
                  <p className="text-lg text-secondary-600 leading-relaxed">{assessment.description}</p>
                </div>
              </div>
            
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative overflow-hidden rounded-xl border-2 border-primary-500/30 bg-gradient-to-br from-primary-50/80 to-white/80 backdrop-blur-sm p-6 group/stat hover:border-primary-500/50 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 group-hover/stat:scale-110 transition-transform duration-300">
                      <Clock className="w-7 h-7 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary-600 uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{assessment.duration} min</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-xl border-2 border-secondary-500/30 bg-gradient-to-br from-secondary-50/80 to-white/80 backdrop-blur-sm p-6 group/stat hover:border-secondary-500/50 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary-500/10 to-transparent rounded-bl-full"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border border-secondary-500/30 group-hover/stat:scale-110 transition-transform duration-300">
                      <Award className="w-7 h-7 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary-600 uppercase tracking-wider mb-1">Passing Score</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{assessment.passingScore}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 to-white/80 backdrop-blur-sm p-6 mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900">Instructions:</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <span className="flex-1">You have <strong>{assessment.duration} minutes</strong> to complete this assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <span className="flex-1">Answer all <strong>{assessment.questions.length} questions</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <span className="flex-1">You need <strong>{assessment.passingScore}%</strong> to pass and earn a certificate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">4</span>
                      </div>
                      <span className="flex-1">Once started, the timer <strong>cannot be paused</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">5</span>
                      </div>
                      <span className="flex-1">Review your answers before submitting</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                className="relative w-full group/btn overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-5 text-xl font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Award className="w-6 h-6" />
                  Start Assessment
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card relative overflow-hidden mb-6 animate-[floatUp_0.6s_ease-out]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-base font-bold text-gray-900">
                  Question {currentQuestion + 1} <span className="text-secondary-600">of {assessment.questions.length}</span>
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                timeLeft < 60 
                  ? 'bg-red-500/20 text-red-700 border-2 border-red-500/30 animate-pulse' 
                  : 'bg-primary-500/20 text-primary-700 border-2 border-primary-500/30'
              }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ 
                  width: `${progress}%`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite'
                }}
              />
            </div>
            <div className="mt-2 text-xs text-secondary-600 text-right font-medium">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="card relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-6 animate-[floatUp_0.6s_ease-out_0.1s_both]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">{question.question}</h2>
          
            {question.type === 'mcq' && (
              <div className="space-y-4">
                {question.options?.map((option: string, idx: number) => (
                  <label
                    key={idx}
                    className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 group/option ${
                      answers[question.id] === option
                        ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        answers[question.id] === option
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 bg-white group-hover/option:border-primary-400'
                      }`}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="sr-only"
                        />
                        {answers[question.id] === option && (
                          <div className="h-3 w-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={`flex-1 text-base font-medium transition-colors ${
                        answers[question.id] === option ? 'text-primary-900' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'multiple_select' && (
              <div className="space-y-4">
                {question.options?.map((option: string, idx: number) => (
                  <label
                    key={idx}
                    className={`relative block p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 group/option ${
                      answers[question.id]?.includes(option)
                        ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                        answers[question.id]?.includes(option)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 bg-white group-hover/option:border-primary-400'
                      }`}>
                        <input
                          type="checkbox"
                          value={option}
                          checked={answers[question.id]?.includes(option) || false}
                          onChange={(e) => {
                            const current = answers[question.id] || []
                            const updated = e.target.checked
                              ? [...current, option]
                              : current.filter((o: string) => o !== option)
                            handleAnswer(question.id, updated)
                          }}
                          className="sr-only"
                        />
                        {answers[question.id]?.includes(option) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`flex-1 text-base font-medium transition-colors ${
                        answers[question.id]?.includes(option) ? 'text-primary-900' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {(question.type === 'short_answer' || question.type === 'scenario') && (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                rows={8}
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm"
                placeholder="Type your answer here..."
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 animate-[floatUp_0.6s_ease-out_0.2s_both]">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-8 py-4 text-base font-bold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Previous
          </button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="relative px-8 py-4 text-base font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Next</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="relative px-8 py-4 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    Submit Assessment
                  </>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
