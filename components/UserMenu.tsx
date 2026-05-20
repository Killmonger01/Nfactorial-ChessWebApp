'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User | null
  loading: boolean
  onSignOut: () => void
  onSignIn: () => void
}

export default function UserMenu({ user, loading, onSignOut, onSignIn }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: '#0f3460' }} />
    )
  }

  if (!user) {
    return (
      <button
        onClick={onSignIn}
        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: '#769656' }}
      >
        Sign In
      </button>
    )
  }

  const initials = user.email ? user.email[0].toUpperCase() : '?'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: '#769656' }}
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl border z-50 overflow-hidden"
          style={{ background: '#16213e', borderColor: '#0f3460' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#0f3460' }}>
            <p className="text-xs font-semibold text-white truncate">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors"
          >
            Profile &amp; Stats
          </Link>
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
