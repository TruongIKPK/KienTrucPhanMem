import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant =
  | 'primaryMint'
  | 'secondarySlate'
  | 'outlinedMint'
  | 'outlinedUV'
  | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const VARIANT: Record<Variant, string> = {
  primaryMint:
    'bg-mint text-canvas border border-mintBorder hover:brightness-110 active:brightness-95',
  secondarySlate:
    'bg-slate text-hazardWhite border border-slate hover:bg-canvas hover:border-mint',
  outlinedMint:
    'bg-transparent text-mint border border-mint hover:bg-mint hover:text-canvas',
  outlinedUV:
    'bg-transparent text-hazardWhite border border-ultraviolet hover:bg-ultraviolet',
  ghost: 'bg-transparent text-hazardWhite hover:text-mint',
}

const SIZE: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primaryMint', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center rounded-pill font-mono uppercase tracking-kicker',
          'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focusCyan',
          VARIANT[variant],
          SIZE[size],
          className,
        ].join(' ')}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
