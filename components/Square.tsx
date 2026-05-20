import type { Piece as PieceType, Square } from '@/lib/types'
import PieceComponent from './Piece'

interface SquareProps {
  row: number
  col: number
  piece: PieceType | null
  isLight: boolean
  isSelected: boolean
  isLegalMove: boolean
  isLastMoveFrom: boolean
  isLastMoveTo: boolean
  onClick: (sq: Square) => void
}

export default function SquareComponent({
  row,
  col,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isLastMoveFrom,
  isLastMoveTo,
  onClick,
}: SquareProps) {
  const baseColor = isLight ? '#f0d9b5' : '#b58863'

  let bg = baseColor
  if (isSelected) {
    bg = isLight ? '#f6f668' : '#baca2b'
  } else if (isLastMoveFrom || isLastMoveTo) {
    bg = isLight ? '#cdd16f' : '#aaa23a'
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${String.fromCharCode(97 + col)}${8 - row}`}
      onClick={() => onClick({ row, col })}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick({ row, col }) }}
      style={{ backgroundColor: bg }}
      className="relative flex items-center justify-center w-full h-full cursor-pointer"
    >
      {/* Legal move dot */}
      {isLegalMove && !piece && (
        <div
          className="rounded-full pointer-events-none"
          style={{
            width: '30%',
            height: '30%',
            backgroundColor: 'rgba(0,0,0,0.18)',
          }}
        />
      )}
      {/* Legal move capture ring */}
      {isLegalMove && piece && (
        <div
          className="absolute inset-0 rounded-none pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 4px rgba(0,0,0,0.22)',
          }}
        />
      )}
      {piece && <PieceComponent piece={piece} />}

      {/* Rank label (left side, col 0) */}
      {col === 0 && (
        <span
          className="absolute top-0.5 left-0.5 text-xs font-semibold pointer-events-none"
          style={{ color: isLight ? '#b58863' : '#f0d9b5', fontSize: '0.65rem' }}
        >
          {8 - row}
        </span>
      )}
      {/* File label (bottom, row 7) */}
      {row === 7 && (
        <span
          className="absolute bottom-0.5 right-0.5 text-xs font-semibold pointer-events-none"
          style={{ color: isLight ? '#b58863' : '#f0d9b5', fontSize: '0.65rem' }}
        >
          {String.fromCharCode(97 + col)}
        </span>
      )}
    </div>
  )
}
