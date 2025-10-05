'use client'

import CounterDisplay from '@/components/CounterDisplay'
import { useCounter } from '@/contexts/CounterContext'

// Additional component that also uses the counter context
function CounterInfo() {
  const { count } = useCounter()
  
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Counter Info</h3>
      <div className="text-sm text-blue-700">
        <p>Current value: <span className="font-mono font-bold">{count}</span></p>
        <p>Is even: <span className="font-bold">{count % 2 === 0 ? 'Yes' : 'No'}</span></p>
        <p>Absolute value: <span className="font-bold">{Math.abs(count)}</span></p>
      </div>
    </div>
  )
}

export default function CounterDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Counter Context Demo
          </h1>
          <p className="text-gray-600">
            This demonstrates React Context API usage with a shared counter state
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Counter Display */}
          <CounterDisplay />
          
          {/* Additional component using the same context */}
          <CounterInfo />
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Both components above share the same counter state through React Context API
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}