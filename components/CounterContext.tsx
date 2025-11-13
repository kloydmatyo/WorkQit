'use client'

import { useCounter } from '@/contexts/CounterContext'
import { Plus, Minus, RotateCcw } from 'lucide-react'

// Child component using Context (AFTER refactoring)
function CounterDisplayContext() {
  const { count, increment, decrement, reset } = useCounter()

  return (
    <div className="max-w-md mx-auto p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          ✅ Context API Version
        </h3>
        
        {/* Count Display */}
        <div className="mb-6">
          <div className="text-5xl font-bold text-green-600 mb-2">
            {count}
          </div>
          <div className="text-sm text-green-500">Current Count (via Context)</div>
        </div>

        {/* Counter Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={decrement}
            className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
            aria-label="Decrement counter"
          >
            <Minus size={20} />
          </button>
          
          <button
            onClick={increment}
            className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200"
            aria-label="Increment counter"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 mx-auto"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {/* Context Info */}
        <div className="mt-4 text-xs text-green-400 bg-green-100 p-2 rounded">
          ✅ Getting data directly from Context API
        </div>
      </div>
    </div>
  )
}

// Intermediate component that doesn't need to handle props
function CounterWrapperContext() {
  return (
    <div className="p-4 bg-green-25 border border-green-100 rounded-lg">
      <h4 className="text-sm font-semibold text-green-700 mb-3 text-center">
        🎯 Intermediate Component (No Props Needed)
      </h4>
      
      {/* This component doesn't need to receive or pass any props */}
      <CounterDisplayContext />
      
      <div className="mt-2 text-xs text-green-400 text-center">
        This component is clean - no props to pass! ✨
      </div>
    </div>
  )
}

// Parent component using Context (AFTER refactoring)
export default function CounterContextVersion() {
  const { count } = useCounter()

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Context API Example (AFTER)
        </h2>
        <p className="text-gray-600 text-sm">
          State managed in context, accessed directly by components that need it
        </p>
      </div>

      {/* Context info in parent */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-800">Parent Component:</h3>
        <p className="text-sm text-green-600">Can access count: {count}</p>
        <p className="text-xs text-green-500 mt-1">
          ✅ No state management needed - context handles it
        </p>
      </div>

      {/* Wrapper component with no props needed */}
      <CounterWrapperContext />

      {/* Context benefits visualization */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 text-sm mb-2">Context API Benefits:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• No props drilling - components get data directly from context</li>
          <li>• Intermediate components stay clean and focused</li>
          <li>• Easy to add new components that need counter data</li>
          <li>• Single source of truth for counter state</li>
          <li>• Type-safe with TypeScript</li>
        </ul>
      </div>
    </div>
  )
}