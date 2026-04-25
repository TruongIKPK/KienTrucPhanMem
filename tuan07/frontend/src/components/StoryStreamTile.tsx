import type { ReactNode } from 'react'

interface StoryStreamTileProps {
  kicker?: string
  timestamp?: string
  headline: string
  deck?: string
  accent?: 'mint' | 'ultraviolet' | 'yellow' | 'pink' | 'orange' | 'white' | 'slate'
  children?: ReactNode
}

const ACCENT_FILL: Record<NonNullable<StoryStreamTileProps['accent']>, string> = {
  mint: 'bg-mint text-canvas',
  ultraviolet: 'bg-ultraviolet text-hazardWhite',
  yellow: 'bg-tileYellow text-canvas',
  pink: 'bg-tilePink text-canvas',
  orange: 'bg-tileOrange text-canvas',
  white: 'bg-hazardWhite text-canvas',
  slate: 'bg-slate text-hazardWhite',
}

export function StoryStreamTile({
  kicker,
  timestamp,
  headline,
  deck,
  accent = 'slate',
  children,
}: StoryStreamTileProps) {
  return (
    <article
      className={[
        'rounded-card p-6 md:p-8 flex flex-col gap-4',
        'border border-purpleRule/40',
        ACCENT_FILL[accent],
      ].join(' ')}
    >
      <header className="flex items-center justify-between gap-4">
        {kicker && <span className="kicker text-current/80">{kicker}</span>}
        {timestamp && <span className="kicker text-current/60">{timestamp}</span>}
      </header>
      <h2 className="font-display leading-display text-[40px] md:text-[56px] uppercase">
        {headline}
      </h2>
      {deck && (
        <p className="font-sans text-base leading-relaxed text-current/90 max-w-2xl">
          {deck}
        </p>
      )}
      {children}
    </article>
  )
}
