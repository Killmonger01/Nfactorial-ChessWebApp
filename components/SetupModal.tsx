'use client'

import { useState } from 'react'
import type { GameMode } from '@/hooks/useChess'

interface Props {
  onStart: (mode: GameMode, skillLevel: number) => void
  onStartMultiplayer?: () => void
  multiplayerLoading?: boolean
}

const DIFFICULTIES = [
  { label: 'Easy',   skillLevel: 2,  description: 'Makes mistakes, good for beginners' },
  { label: 'Medium', skillLevel: 10, description: 'A fair challenge' },
  { label: 'Hard',   skillLevel: 20, description: 'Near-perfect play' },
] as const

export default function SetupModal({ onStart, onStartMultiplayer, multiplayerLoading }: Props) {
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [selected, setSelected] = useState(10)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        style={{ background: '#16213e', borderColor: '#0f3460' }}
        className="w-full max-w-sm rounded-2xl border-2 p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Chess</h1>
        <p className="mb-8 text-center text-sm" style={{ color: '#a0aec0' }}>
          Choose how you want to play
        </p>

        {!showAiPanel ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => onStart('pvp', 10)}
              className="w-full rounded-xl py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#769656' }}
            >
              Play vs Human
            </button>
            <button
              onClick={() => {
                console.log('[MP] button onClick fired, loading:', multiplayerLoading)
                onStartMultiplayer?.()
              }}
              disabled={multiplayerLoading}
              className="w-full rounded-xl py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#16213e', border: '2px solid #0f3460' }}
            >
              {multiplayerLoading ? 'Creating game…' : '🔗 Play with Friend'}
            </button>
            <button
              onClick={() => setShowAiPanel(true)}
              className="w-full rounded-xl py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#0f3460' }}
            >
              Play vs AI
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-center font-semibold text-white">Select Difficulty</p>
            <div className="flex flex-col gap-3 mb-6">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.skillLevel}
                  onClick={() => setSelected(d.skillLevel)}
                  className="flex flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition-all"
                  style={{
                    borderColor: selected === d.skillLevel ? '#769656' : '#0f3460',
                    background: selected === d.skillLevel ? '#0f3460' : 'transparent',
                  }}
                >
                  <span className="font-semibold text-white">{d.label}</span>
                  <span className="text-xs" style={{ color: '#a0aec0' }}>
                    {d.description}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAiPanel(false)}
                className="flex-1 rounded-xl border py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ borderColor: '#0f3460' }}
              >
                Back
              </button>
              <button
                onClick={() => onStart('ai', selected)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: '#769656' }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
