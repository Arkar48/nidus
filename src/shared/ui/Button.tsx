import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'ink' | 'ghost'
}

const variants = {
  ink: 'border-0 bg-paper text-ink px-[22px] py-3 text-[0.68rem] uppercase tracking-[0.14em] transition-[transform,background] duration-200 ease-out hover:-translate-y-0.5 hover:bg-veil',
  ghost:
    'border-0 bg-transparent text-mist-warm px-0 py-3 text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-200 hover:text-accent',
} as const

export function Button({
  variant = 'ink',
  className = '',
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`${variants[variant]} ${className}`.trim()}
      {...props}
    />
  )
}
