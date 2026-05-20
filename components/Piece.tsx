import type { Piece } from '@/lib/types'

const UNICODE: Record<string, Record<string, string>> = {
  white: {
    king:   '♚',
    queen:  '♛',
    rook:   '♜',
    bishop: '♝',
    knight: '♞',
    pawn:   '♟',
  },
  black: {
    king:   '♚',
    queen:  '♛',
    rook:   '♜',
    bishop: '♝',
    knight: '♞',
    pawn:   '♟',
  },
}

interface PieceProps {
  piece: Piece
}

export default function PieceComponent({ piece }: PieceProps) {
  const symbol = UNICODE[piece.color][piece.type]

  return (
    <span
      className="select-none leading-none"
      style={{
        display: 'block',
        fontSize: '2.6rem',
        lineHeight: 1,
        color:
          piece.color === 'white' ? '#ffffff' : '#1a1a1a',
        textShadow:
          piece.color === 'white'
            ? '0 2px 4px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8)'
            : '0 1px 3px rgba(0,0,0,0.6)',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
        transition: 'transform 0.15s ease',
        userSelect: 'none',
      }}
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  )
}
