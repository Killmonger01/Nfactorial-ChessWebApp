import type { Board, Move, Square } from '@/lib/types'
import SquareComponent from './Square'

interface BoardProps {
  board: Board
  selectedSquare: Square | null
  legalMoves: Square[]
  lastMove: Move | null
  onSquareClick: (sq: Square) => void
}

export default function BoardComponent({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  onSquareClick,
}: BoardProps) {
  const legalSet = new Set(legalMoves.map(m => `${m.row},${m.col}`))

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: 'min(90vw, 90vh, 560px)',
        height: 'min(90vw, 90vh, 560px)',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
      }}
    >
      {board.map((rowArr, row) =>
        rowArr.map((piece, col) => {
          const isLight = (row + col) % 2 === 0
          const isSelected = !!selectedSquare && selectedSquare.row === row && selectedSquare.col === col
          const isLegal = legalSet.has(`${row},${col}`)
          const isLastFrom = !!lastMove && lastMove.from.row === row && lastMove.from.col === col
          const isLastTo = !!lastMove && lastMove.to.row === row && lastMove.to.col === col

          return (
            <SquareComponent
              key={`${row}-${col}`}
              row={row}
              col={col}
              piece={piece}
              isLight={isLight}
              isSelected={isSelected}
              isLegalMove={isLegal}
              isLastMoveFrom={isLastFrom}
              isLastMoveTo={isLastTo}
              onClick={onSquareClick}
            />
          )
        })
      )}
    </div>
  )
}
