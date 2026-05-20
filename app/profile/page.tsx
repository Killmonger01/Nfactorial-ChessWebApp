'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getUserGames, getUserStats, type GameRow, type UserStats } from '@/lib/db'
import AuthModal from '@/components/AuthModal'
import ReplayModal from '@/components/ReplayModal'

const RESULT_LABEL: Record<string, { label: string; color: string }> = {
  white_wins: { label: 'Win',  color: '#769656' },
  black_wins: { label: 'Loss', color: '#e05252' },
  draw:       { label: 'Draw', color: '#a0aec0' },
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl px-6 py-4"
      style={{ background: '#0f3460' }}
    >
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs mt-1" style={{ color: '#a0aec0' }}>{label}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  const [stats,   setStats]   = useState<UserStats | null>(null)
  const [games,   setGames]   = useState<GameRow[]>([])
  const [dbError, setDbError] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [replayGame, setReplayGame] = useState<GameRow | null>(null)

  // Redirect to sign-in modal if not logged in after auth resolves
  useEffect(() => {
    if (!authLoading && !user) setAuthOpen(true)
  }, [authLoading, user])

  useEffect(() => {
    if (!user) return
    Promise.all([getUserStats(user.id), getUserGames(user.id)])
      .then(([s, g]) => { setStats(s); setGames(g) })
      .catch(err => setDbError(String(err)))
  }, [user])

  return (
    <>
      {authOpen && (
        <AuthModal onClose={() => {
          setAuthOpen(false)
          if (!user) router.push('/')
        }} />
      )}

      {replayGame && (
        <ReplayModal game={replayGame} onClose={() => setReplayGame(null)} />
      )}

      {/* Header */}
      <header
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ background: '#0f3460' }}
      >
        <Link href="/" className="text-white font-bold tracking-wide hover:opacity-80 transition-opacity">
          ♟ Chess
        </Link>
        {user && (
          <button
            onClick={signOut}
            className="text-sm text-red-400 hover:opacity-80 transition-opacity"
          >
            Sign Out
          </button>
        )}
      </header>

      <main
        className="min-h-[calc(100vh-52px)] p-6 max-w-3xl mx-auto"
        style={{ color: '#fff' }}
      >
        {authLoading && (
          <p className="text-center mt-20" style={{ color: '#a0aec0' }}>Loading…</p>
        )}

        {!authLoading && user && (
          <>
            {/* Email */}
            <h1 className="text-xl font-bold mb-1">{user.email}</h1>
            <p className="text-xs mb-8" style={{ color: '#a0aec0' }}>Member since {new Date(user.created_at).toLocaleDateString()}</p>

            {dbError && (
              <p className="text-red-400 text-sm mb-6">{dbError}</p>
            )}

            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
                <StatCard label="Games"    value={stats.total} />
                <StatCard label="Wins"     value={stats.wins} />
                <StatCard label="Losses"   value={stats.losses} />
                <StatCard label="Draws"    value={stats.draws} />
                <StatCard label="Win Rate" value={`${stats.winRate}%`} />
              </div>
            )}

            {/* Game history */}
            <h2 className="text-lg font-semibold mb-4">Game History</h2>
            {games.length === 0 ? (
              <p className="text-sm" style={{ color: '#a0aec0' }}>
                No games recorded yet. Play a game and finish it to save it here.
              </p>
            ) : (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#0f3460' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#0f3460', color: '#a0aec0' }}>
                      <th className="text-left px-4 py-2 font-semibold">Date</th>
                      <th className="text-left px-4 py-2 font-semibold">Opponent</th>
                      <th className="text-left px-4 py-2 font-semibold">Difficulty</th>
                      <th className="text-left px-4 py-2 font-semibold">Result</th>
                      <th className="text-right px-4 py-2 font-semibold">Moves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((g, i) => {
                      const res = RESULT_LABEL[g.result] ?? { label: g.result, color: '#a0aec0' }
                      return (
                        <tr
                          key={g.id}
                          onClick={() => setReplayGame(g)}
                          className="cursor-pointer transition-colors"
                          style={{
                            background: i % 2 === 0 ? '#16213e' : '#1a2a50',
                            borderTop: '1px solid #0f3460',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1e3a6e')}
                          onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#16213e' : '#1a2a50')}
                        >
                          <td className="px-4 py-2.5" style={{ color: '#a0aec0' }}>
                            {new Date(g.played_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2.5 capitalize">{g.opponent}</td>
                          <td className="px-4 py-2.5" style={{ color: '#a0aec0' }}>
                            {g.ai_difficulty ? DIFFICULTY_LABEL[g.ai_difficulty] ?? g.ai_difficulty : '—'}
                          </td>
                          <td className="px-4 py-2.5 font-semibold" style={{ color: res.color }}>
                            {res.label}
                          </td>
                          <td className="px-4 py-2.5 text-right" style={{ color: '#a0aec0' }}>
                            {g.moves_count}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
