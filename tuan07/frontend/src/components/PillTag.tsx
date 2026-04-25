import type { ReactNode } from 'react'

interface PillTagProps {
  children: ReactNode
  tone?: 'mint' | 'slate' | 'ultraviolet' | 'yellow'
  className?: string
}

const TONE: Record<NonNullable<PillTagProps['tone']>, string> = {
  mint: 'bg-mint text-canvas',
  slate: 'bg-slate text-hazardWhite',
  ultraviolet: 'bg-ultraviolet text-hazardWhite',
  yellow: 'bg-tileYellow text-canvas',
}

export function PillTag({ children, tone = 'mint', className = '' }: PillTagProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-tag px-2 py-0.5',
        'font-mono uppercase tracking-kicker text-[11px]',
        TONE[tone],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
