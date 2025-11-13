'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CounterContextValue {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const CounterContext = createContext<CounterContextValue | undefined>(undefined)

export function useCounter(): CounterContextValue {
  const context = useContext(CounterContext)
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider')
  }
  return context
}

interface CounterProviderProps {
  children: ReactNode
}

export function CounterProvider({ children }: CounterProviderProps) {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(0)

  const contextValue: CounterContextValue = {
    count,
    increment,
    decrement,
    reset,
  }

  return (
    <CounterContext.Provider value={contextValue}>
      {children}
    </CounterContext.Provider>
  )
}