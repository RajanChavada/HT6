import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-bg hover:brightness-110',
  ghost: 'bg-glass text-text border border-white/10 hover:bg-white/10',
  danger: 'bg-danger text-bg hover:brightness-110',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: {
  children: ReactNode
  variant?: Variant
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`min-h-[44px] px-4 rounded-xl font-medium font-body transition-[background,transform,filter] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
