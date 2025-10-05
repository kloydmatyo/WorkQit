'use client'

import { useCounter } from '@/contexts/CounterContext'
import { Plus, Minus, RotateCcw } from 'lucide-react'

export default function CounterDisplay() {
  const { count, increment, decrement, reset } = useCounter()

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Counter Display</h2>
        
        {/* Count Display */}
        <div className="mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {count}
          </div>
          <div className="text-sm text-gray-500">Current Count</div>
        </div>

        {/* Counter Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={decrement}
            className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Decrement counter"
          >
            <Minus size={24} />
          </button>
          
          <button
            onClick={increment}
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
            aria-label="Increment counter"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 mx-auto"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        {/* Counter Status */}
        <div className="mt-4 text-sm">
          <span className={`inline-block px-3 py-1 rounded-full text-white ${
            count > 0 ? 'bg-green-500' : count < 0 ? 'bg-red-500' : 'bg-gray-500'
          }`}>
            {count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero'}
          </span>
        </div>
      </div>
    </div>
  )
}