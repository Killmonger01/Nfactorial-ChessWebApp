import type { HistoryEntry } from '@/lib/types'
import { toAlgebraicNotation } from '@/lib/chess'

interface MoveHistoryProps {
  history: HistoryEntry[]
}

export default function MoveHistory({ history }: MoveHistoryProps) {
  const pairs: string[][] = []
  for (let i = 0; i < history.length; i += 2) {
    const white = toAlgebraicNotation(history[i].move)
    const black = history[i + 1] ? toAlgebraicNotation(history[i + 1].move) : ''
    pairs.push([white, black])
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
        Move History
      </h2>
      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
        {pairs.length === 0 && (
          <p className="text-gray-500 text-sm">No moves yet.</p>
        )}
        {pairs.map(([white, black], idx) => (
          <div key={idx} className="flex text-sm font-mono gap-2">
            <span className="text-gray-500 w-6 shrink-0">{idx + 1}.</span>
            <span className="text-gray-200 w-16">{white}</span>
            <span className="text-gray-400 w-16">{black}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
