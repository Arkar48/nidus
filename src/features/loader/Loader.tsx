import { useRef } from 'react'
import type { LoaderProps } from './constants'
import { useLoaderBoot } from './useLoaderBoot'

export function Loader({ onReveal, onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLParagraphElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)

  const { progress } = useLoaderBoot(
    { onReveal, onComplete },
    { rootRef, brandRef, statusRef },
  )

  return (
    <div
      ref={rootRef}
      className="gate fixed inset-0 z-[80] grid place-items-center bg-void text-paper"
      role="status"
      aria-live="polite"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="gate__stack grid w-[min(88vw,22rem)] justify-items-center gap-6 text-center">
        <p
          ref={brandRef}
          className="gate__brand m-0 font-display text-[0.78rem] font-bold tracking-[0.32em] text-paper"
        >
          NIDUS
        </p>

        <div className="gate__track w-full overflow-hidden">
          <span
            className="gate__fill block h-px w-full origin-left bg-ember"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        <p
          ref={statusRef}
          className="gate__status m-0 min-h-[1.2em] text-[0.72rem] tracking-[0.06em] text-mist-soft"
        >
          warming the nest
        </p>
      </div>
    </div>
  )
}
