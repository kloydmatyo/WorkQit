'use client'

import CounterParent from '@/components/CounterParent'
import CounterContextVersion from '@/components/CounterContext'

export default function CounterComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Props Drilling vs Context API
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare the "before" and "after" approaches to sharing state between components.
            The left side shows props drilling (problematic), and the right side shows the Context API solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Props Drilling Version (BEFORE) */}
          <div className="space-y-4">
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-red-800 text-center mb-2">
                🔴 BEFORE: Props Drilling
              </h2>
              <p className="text-red-600 text-center text-sm">
                State passed down through component tree as props
              </p>
            </div>
            <CounterParent />
          </div>

          {/* Context API Version (AFTER) */}
          <div className="space-y-4">
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-green-800 text-center mb-2">
                ✅ AFTER: Context API
              </h2>
              <p className="text-green-600 text-center text-sm">
                Components access state directly from context
              </p>
            </div>
            <CounterContextVersion />
          </div>
        </div>

        {/* Key Differences */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Key Differences
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Props Drilling Issues */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-800 flex items-center">
                  <span className="text-2xl mr-2">🔴</span>
                  Props Drilling Issues
                </h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Parent component must manage all state
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Props passed through components that don't use them
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Hard to maintain as app grows
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Adding features requires changing multiple components
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Tightly coupled components
                  </li>
                </ul>
              </div>

              {/* Context API Benefits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  Context API Benefits
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Single source of truth for state
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Components get data directly when needed
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Cleaner, more maintainable code
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Easy to add new consumers
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Loosely coupled components
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Try Both Versions!
            </h3>
            <p className="text-blue-600 text-sm">
              Interact with both counters above to see how they work the same way, 
              but the Context API version is much cleaner and more maintainable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}