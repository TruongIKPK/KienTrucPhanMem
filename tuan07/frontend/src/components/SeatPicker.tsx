import { useMemo } from 'react'

interface SeatPickerProps {
  rows?: number
  cols?: number
  selected: string[]
  onToggle: (seat: string) => void
  takenSeats?: string[]
  maxSelection?: number
}

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export function SeatPicker({
  rows = 6,
  cols = 8,
  selected,
  onToggle,
  takenSeats = [],
  maxSelection = 8,
}: SeatPickerProps) {
  const seats = useMemo(() => {
    const result: string[][] = []
    for (let r = 0; r < rows; r++) {
      const row: string[] = []
      for (let c = 1; c <= cols; c++) {
        row.push(`${ROW_LABELS[r]}${c}`)
      }
      result.push(row)
    }
    return result
  }, [rows, cols])

  const taken = useMemo(() => new Set(takenSeats), [takenSeats])
  const sel = useMemo(() => new Set(selected), [selected])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="w-3/4 h-2 rounded-pill bg-mint/40" />
      </div>
      <p className="kicker text-center text-secondary">SCREEN</p>

      <div className="flex flex-col gap-2 mx-auto">
        {seats.map((row, ri) => (
          <div key={ri} className="flex gap-2 items-center">
            <span className="kicker w-6 text-right text-secondary">
              {ROW_LABELS[ri]}
            </span>
            {row.map((seat) => {
              const isTaken = taken.has(seat)
              const isSelected = sel.has(seat)
              const disabled =
                isTaken || (!isSelected && selected.length >= maxSelection)
              return (
                <button
                  key={seat}
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggle(seat)}
                  className={[
                    'w-9 h-9 rounded-tag border text-[11px] font-mono transition',
                    isTaken && 'bg-slate text-secondary border-slate cursor-not-allowed',
                    !isTaken && isSelected && 'bg-mint text-canvas border-mintBorder',
                    !isTaken && !isSelected && 'bg-canvas text-hazardWhite border-hazardWhite/30 hover:border-mint',
                    disabled && !isSelected && !isTaken && 'opacity-40 cursor-not-allowed',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {seat.slice(1)}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-[11px] font-mono uppercase tracking-kicker text-secondary">
        <Legend swatch="bg-canvas border border-hazardWhite/30" label="Available" />
        <Legend swatch="bg-mint border border-mintBorder" label="Selected" />
        <Legend swatch="bg-slate border border-slate" label="Taken" />
      </div>
    </div>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-4 h-4 rounded-tag ${swatch}`} />
      {label}
    </span>
  )
}
