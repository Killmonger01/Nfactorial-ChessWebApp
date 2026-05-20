'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import BoardComponent from '@/components/Board'
import GameStatus from '@/components/GameStatus'
import MoveHistory from '@/components/MoveHistory'
import SetupModal from '@/components/SetupModal'
import AuthModal from '@/components/AuthModal'
import UserMenu from '@/components/UserMenu'
import { useChess, type GameMode } from '@/hooks/useChess'
import { useAuth } from '@/hooks/useAuth'
import { saveGame } from '@/lib/db'
import { toAlgebraicNotation, createInitialGameState } from '@/lib/chess'
import { supabase } from '@/lib/supabase'
import { createMultiplayerGame, getOrCreatePlayerId } from '@/lib/multiplayer'

const DIFFICULTY_LABELS: Record<number, string> = {
  2: 'Easy',
  10: 'Medium',
  20: 'Hard',
}

export default function Home() {
  const router = useRouter()

  const {
    gameState,
    history,
    selectedSquare,
    legalMoves,
    lastMove,
    mode,
    skillLevel,
    movesCount,
    aiThinking,
    engineReady,
    handleSquareClick,
    undoMove,
    newGame,
  } = useChess()

  const { user, loading: authLoading, signOut } = useAuth()

  const [setupOpen, setSetupOpen]         = useState(false)
  const [authOpen, setAuthOpen]           = useState(false)
  const [mpLoading, setMpLoading]         = useState(false)
  // Prevents saving the same completed game more than once
  const gameSavedRef = useRef<boolean>(false)

  // Show setup modal on first load if there is no saved game
  useEffect(() => {
    const saved = localStorage.getItem('chess_game_state_v2')
    if (!saved) setSetupOpen(true)
  }, [])

  // Auto-save completed games for logged-in users
  useEffect(() => {
    if (!user) return
    if (!gameState.isCheckmate && !gameState.isStalemate) return
    if (gameSavedRef.current) return  // already saved this game

    gameSavedRef.current = true

    // Derive result from whose turn it is when checkmate/stalemate is detected
    const result: 'white_wins' | 'black_wins' | 'draw' = gameState.isStalemate
      ? 'draw'
      : gameState.currentTurn === 'black'
        ? 'white_wins'   // black is in checkmate → white wins
        : 'black_wins'   // white is in checkmate → black wins

    // Inline difficulty mapping: 0-2 easy, 3-10 medium, 11-20 hard
    const ai_difficulty: 'easy' | 'medium' | 'hard' | null =
      mode !== 'ai' ? null
        : skillLevel <= 2  ? 'easy'
        : skillLevel <= 10 ? 'medium'
        : 'hard'

    const pgn = history.map(e => toAlgebraicNotation(e.move)).join(' ')

    saveGame({
      user_id:      user.id,
      pgn,
      result,
      opponent:     mode === 'ai' ? 'ai' : 'human',
      ai_difficulty,
      moves_count:  movesCount,
    }).catch(err => console.error('Failed to save game:', err))
  }, [gameState.isCheckmate, gameState.isStalemate, gameState.currentTurn, user, movesCount, history, mode, skillLevel])

  // Reset the save flag whenever a new game begins
  useEffect(() => {
    if (movesCount === 0) gameSavedRef.current = false
  }, [movesCount])

  function handleStart(m: GameMode, skill: number) {
    setSetupOpen(false)
    newGame(m, skill)
  }

  async function handleStartMultiplayer() {
    if (mpLoading) return
    console.log('[MP] Play with Friend clicked')
    setMpLoading(true)
    setSetupOpen(false)
    try {
      const playerId     = getOrCreatePlayerId()
      console.log('[MP] player id:', playerId)
      const initialState = createInitialGameState()
      const gameId       = await createMultiplayerGame(supabase, initialState, playerId)
      console.log('[MP] game created, id:', gameId)
      router.push(`/play/${gameId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[MP] createMultiplayerGame failed:', msg)
      // Show the error visibly so the user (and developer) can act on it
      window.alert(
        `Could not create multiplayer game:\n\n${msg}\n\n` +
        'Make sure the multiplayer_games table exists in Supabase ' +
        'and your NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars are set.'
      )
      // Reopen modal so the user can try another mode
      setSetupOpen(true)
    } finally {
      setMpLoading(false)
    }
  }

  const diffLabel = DIFFICULTY_LABELS[skillLevel] ?? `Level ${skillLevel}`

  return (
    <>
      {setupOpen && (
        <SetupModal
          onStart={handleStart}
          onStartMultiplayer={handleStartMultiplayer}
          multiplayerLoading={mpLoading}
        />
      )}
      {authOpen  && <AuthModal  onClose={() => setAuthOpen(false)} />}

      {/* ── Top header ───────────────────────────────────────────────────── */}
      <header
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ background: '#0f3460' }}
      >
        <span className="text-white font-bold tracking-wide">♟ Chess</span>
        <UserMenu
          user={user}
          loading={authLoading}
          onSignOut={signOut}
          onSignIn={() => setAuthOpen(true)}
        />
      </header>

      <main className="min-h-[calc(100vh-52px)] flex flex-col items-center justify-center p-4 gap-6">
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-5xl">
          {/* Board */}
          <div className="flex-1 flex justify-center relative">
            <BoardComponent
              board={gameState.board}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              onSquareClick={handleSquareClick}
            />
            {/* AI thinking overlay */}
            {aiThinking && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="rounded-xl px-4 py-2 text-white text-sm font-semibold shadow-lg"
                  style={{ background: 'rgba(15,52,96,0.85)' }}
                >
                  AI is thinking…
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            className="w-full lg:w-64 flex flex-col gap-4 rounded-xl p-4"
            style={{ backgroundColor: '#16213e', minHeight: '280px' }}
          >
            {/* Mode indicator */}
            <div className="text-xs text-center rounded-lg py-1 px-2" style={{ background: '#0f3460', color: '#a0aec0' }}>
              {mode === 'ai'
                ? `🤖 vs AI — ${diffLabel}${!engineReady ? ' (loading…)' : ''}`
                : '👥 Two Players'}
            </div>

            {/* Status */}
            <GameStatus gameState={gameState} onNewGame={() => newGame(mode, skillLevel)} />

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setSetupOpen(true)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
              >
                New Game
              </button>
              <button
                onClick={undoMove}
                disabled={history.length === 0 || aiThinking}
                className="flex-1 py-2 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Undo
              </button>
            </div>

            {/* Move history */}
            <div className="flex-1 overflow-hidden" style={{ maxHeight: '360px' }}>
              <MoveHistory history={history} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
