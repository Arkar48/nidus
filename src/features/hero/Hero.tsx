import { useMemo, useRef } from 'react'
import { makeShootPool, makeStars } from '@/shared/lib/stars'
import { Button, StarField } from '@/shared/ui'
import { HERO_LAYERS, SHOOT_POOL_SIZE, STAR_COUNT, TITLE_LINES } from './constants'
import { useHeroMotion } from './useHeroMotion'

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const stars = useMemo(() => makeStars(STAR_COUNT), [])
  const shoots = useMemo(() => makeShootPool(SHOOT_POOL_SIZE), [])

  useHeroMotion(rootRef)

  return (
    <section
      ref={rootRef}
      className="hero relative h-svh bg-void max-[960px]:h-dvh max-[960px]:min-h-svh max-[960px]:overflow-hidden"
      id="keep"
    >
      <div className="hero__stage relative h-full overflow-hidden bg-void">
        <StarField
          stars={stars}
          shoots={shoots}
          className="hero__stars pointer-events-none absolute inset-0 z-1"
          starClassName="hero__star"
          shootClassName="hero__shoot"
        />

        {HERO_LAYERS.map((layer) => (
          <figure key={layer.id} className={layer.className} aria-hidden="true">
            <div className="hero__layer-shift will-change-transform">
              <img
                src={layer.src}
                alt=""
                draggable={false}
                className="block h-auto w-full object-contain"
              />
            </div>
          </figure>
        ))}

        <div className="hero__copyblock relative z-8 max-w-[min(52rem,72vw)] overflow-visible px-[6vw] pt-[16vh] [text-shadow:0_2px_24px_var(--shadow-deep),0_0_40px_var(--shadow-soft)] max-[960px]:absolute max-[960px]:right-auto max-[960px]:bottom-[clamp(18%,16vw,26%)] max-[960px]:left-0 max-[960px]:max-w-[min(94vw,40rem)] max-[960px]:px-[5vw] max-[960px]:pt-0 max-sm:bottom-[clamp(20%,26vw,30%)] max-sm:max-w-[min(96vw,28rem)]">
          <p className="hero__kicker mb-[18px] text-[0.68rem] uppercase tracking-[0.22em] text-ember">
            protocol / red keep
          </p>
          <h1
            className="hero__title w-max max-w-none cursor-pointer overflow-visible font-display text-[clamp(2.1rem,4.4vw,3.8rem)] font-bold leading-[1.08] tracking-[0.04em] text-paper uppercase whitespace-nowrap max-[960px]:text-[clamp(1.7rem,5vw,2.6rem)] max-sm:text-[clamp(1.35rem,6.8vw,1.85rem)] max-sm:tracking-[0.03em]"
            aria-label={TITLE_LINES.join(' ')}
          >
            {TITLE_LINES.map((line) => (
              <span
                className="hero__line block overflow-visible whitespace-nowrap"
                key={line}
                data-text={line}
                aria-hidden="true"
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="hero__copy mt-[22px] max-w-[34ch] text-[0.82rem] leading-[1.7] text-copy max-sm:mt-3 max-sm:max-w-[28ch] max-sm:text-[0.76rem]">
            Steer with your mouse. Scroll — the nest drifts with you.
          </p>
          <div className="hero__cta mt-7 flex flex-wrap items-center gap-[18px] max-sm:mt-4 max-sm:gap-3.5">
            <Button variant="ink">Enter nest</Button>
            <Button variant="ghost">View collection</Button>
          </div>
        </div>

        <div
          className="hero__fade pointer-events-none absolute inset-x-0 bottom-0 z-6 h-[min(28vh,220px)] max-[960px]:h-[16%] max-sm:h-[14%]"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
