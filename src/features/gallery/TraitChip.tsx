type Props = {
  label: string
  value: string
}

export function TraitChip({ label, value }: Props) {
  return (
    <button
      type="button"
      className="group space-detail__trait grid w-full cursor-pointer gap-1.5 rounded-[14px] border border-[var(--veil-18)] bg-[var(--veil-12)] px-3.5 py-3 text-left text-inherit transition-[transform,background,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--ember-glow)] hover:bg-[var(--veil-1a)] hover:shadow-[0_10px_28px_var(--shadow-mid)] active:translate-y-0 active:scale-[0.98] active:border-ember active:bg-[var(--veil-22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ember"
    >
      <span className="text-[0.62rem] uppercase tracking-[0.14em] text-mist-soft transition-colors duration-200 group-hover:text-ember">
        {label}
      </span>
      <strong className="text-[0.92rem] font-semibold text-paper">{value}</strong>
    </button>
  )
}
