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
        fontSize: '2.4rem',
        lineHeight: 1,
        color:
          piece.color === 'white' ? '#ffffff' : '#1a1a1a',
        textShadow:
          piece.color === 'white'
            ? '0 1px 3px #000, 0 0 1px #000'
            : 'none',
        userSelect: 'none',
      }}
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  )
}
