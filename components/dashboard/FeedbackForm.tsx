'use client'

import React, { useState } from 'react'

interface Props {
  applicationId: string
  applicantName?: string
  onSuccess?: () => void
}

export default function FeedbackForm({ applicationId, applicantName, onSuccess }: Props) {
  const [rating, setRating] = useState<number>(5)
  const [comments, setComments] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!comments.trim()) {
      setError('Please add comments before submitting feedback.')
      return
    }
    if (!rating || rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/applications/${applicationId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, comments }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to submit feedback')
      } else {
        setSuccess('Feedback submitted successfully and applicant notified.')
        setComments('')
        setRating(5)
        if (onSuccess) onSuccess()
      }
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded bg-white shadow-sm space-y-3">
      <div className="text-sm text-gray-700">
        <strong>Submit feedback</strong>
        {applicantName ? <span className="ml-2 text-gray-500">for {applicantName}</span> : null}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 block w-full border px-2 py-1 rounded"
          disabled={loading}
        >
          <option value={5}>5 — Excellent</option>
          <option value={4}>4 — Very Good</option>
          <option value={3}>3 — Good</option>
          <option value={2}>2 — Fair</option>
          <option value={1}>1 — Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="mt-1 block w-full border px-2 py-1 rounded"
          placeholder="Write constructive feedback for the applicant..."
          disabled={loading}
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send feedback'}
        </button>
      </div>
    </form>
  )
}