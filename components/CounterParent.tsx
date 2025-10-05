'use client'

import { useState } from 'react'
import { Plus, Minus, RotateCcw } from 'lucide-react'

// Child component that receives props (BEFORE refactoring)
interface CounterDisplayPropsProps {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

function CounterDisplayProps({ count, increment, decrement, reset }: CounterDisplayPropsProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-red-50 border-2 border-red-200 rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          🔴 Props Drilling Version
        </h3>
        
        {/* Count Display */}
        <div className="mb-6">
          <div className="text-5xl font-bold text-red-600 mb-2">
            {count}
          </div>
          <div className="text-sm text-red-500">Current Count (via props)</div>
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
          className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 mx-auto"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>

        {/* Props Info */}
        <div className="mt-4 text-xs text-red-400 bg-red-100 p-2 rounded">
          ❌ Receiving count and functions as props
        </div>
      </div>
    </div>
  )
}

// Intermediate component that just passes props down (demonstrates props drilling)
interface CounterWrapperProps {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

function CounterWrapper({ count, increment, decrement, reset }: CounterWrapperProps) {
  return (
    <div className="p-4 bg-red-25 border border-red-100 rounded-lg">
      <h4 className="text-sm font-semibold text-red-700 mb-3 text-center">
        🔄 Intermediate Component (Props Drilling)
      </h4>
      
      {/* This component doesn't use the props, just passes them down */}
      <CounterDisplayProps 
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />
      
      <div className="mt-2 text-xs text-red-400 text-center">
        This component just passes props down ⬇️
      </div>
    </div>
  )
}

// Parent component that manages state (BEFORE refactoring)
export default function CounterParent() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Props Drilling Example (BEFORE)
        </h2>
        <p className="text-gray-600 text-sm">
          State managed in parent, passed down through multiple components
        </p>
      </div>

      {/* State info in parent */}
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800">Parent Component State:</h3>
        <p className="text-sm text-red-600">Count: {count}</p>
        <p className="text-xs text-red-500 mt-1">
          ❌ Managing state and passing down props to child components
        </p>
      </div>

      {/* Wrapper component that demonstrates props drilling */}
      <CounterWrapper 
        count={count}
        increment={increment}
        decrement={decrement}
        reset={reset}
      />

      {/* Props drilling visualization */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 text-sm mb-2">Props Drilling Issues:</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Parent manages state and passes 4 props down</li>
          <li>• Intermediate component doesn't use props, just passes them</li>
          <li>• Child component receives props but could get them from context</li>
          <li>• Adding new functionality requires prop changes in all components</li>
        </ul>
      </div>
    </div>
  )
}