import type { GameState } from '@/lib/types'

interface GameStatusProps {
  gameState: GameState
  onNewGame: () => void
}

export default function GameStatus({ gameState, onNewGame }: GameStatusProps) {
  const { currentTurn, isCheck, isCheckmate, isStalemate, winner } = gameState

  return (
    <div className="flex flex-col gap-3">
      {/* Turn indicator */}
      {!isCheckmate && !isStalemate && (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-gray-600 shadow"
            style={{ backgroundColor: currentTurn === 'white' ? '#f0f0f0' : '#1a1a1a' }}
          />
          <span className="text-gray-200 font-medium capitalize">
            {currentTurn}&apos;s turn
          </span>
          {isCheck && (
            <span className="ml-1 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
              CHECK!
            </span>
          )}
        </div>
      )}

      {/* End-game modal overlay */}
      {(isCheckmate || isStalemate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
            <div className="text-5xl">{isCheckmate ? '♛' : '🤝'}</div>
            <h2 className="text-2xl font-bold text-white text-center">
              {isCheckmate
                ? `Checkmate — ${winner === 'white' ? 'White' : 'Black'} wins!`
                : 'Stalemate — Draw!'}
            </h2>
            <p className="text-gray-400 text-center text-sm">
              {isCheckmate
                ? `${winner === 'white' ? 'Black' : 'White'} has no legal moves and is in check.`
                : 'No legal moves available. The game is a draw.'}
            </p>
            <button
              onClick={onNewGame}
              className="mt-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
            >
              Rematch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
