import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="kicker text-hazardWhite/80">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={[
            'rounded-tag border-2 bg-canvas px-3 py-2 text-hazardWhite font-sans',
            'placeholder:text-secondary placeholder:font-mono placeholder:uppercase placeholder:tracking-kicker placeholder:text-[12px]',
            'focus:outline-none focus:border-mint',
            error ? 'border-ultraviolet' : 'border-hazardWhite/30',
            className,
          ].join(' ')}
          {...props}
        />
        {error ? (
          <p className="font-mono text-[11px] uppercase tracking-kicker text-ultraviolet">
            {error}
          </p>
        ) : hint ? (
          <p className="font-mono text-[11px] text-secondary">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'
