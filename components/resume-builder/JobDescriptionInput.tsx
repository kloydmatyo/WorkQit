'use client';

import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  onAnalyze: (description: string, analysis: any) => void;
}

export default function JobDescriptionInput({ onAnalyze }: JobDescriptionInputProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/resume-builder/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: description }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        onAnalyze(description, data.analysis);
      } else {
        setError(data.error || 'Failed to analyze job description');
      }
    } catch (err) {
      setError('An error occurred while analyzing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-600" />
          Enter Job Description
        </h2>
        <p className="text-gray-600">
          Paste the job description you're applying for, and our AI will analyze it to help you create a tailored resume.
        </p>
      </div>

      {/* Input Area */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Paste the complete job description here...

Example:
Job Title: Software Engineer
Company: Tech Corp
Location: Remote

We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || !description.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze & Continue
            </>
          )}
        </button>
      </div>

      {/* Example */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">💡 Tip</h3>
        <p className="text-sm text-purple-700">
          Include the complete job description with requirements, responsibilities, and qualifications for best results. The more details you provide, the better our AI can tailor your resume.
        </p>
      </div>
    </div>
  );
}
