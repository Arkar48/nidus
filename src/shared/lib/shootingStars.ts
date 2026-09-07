import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type ShootingStarsOptions = {
  root: HTMLElement
  shootSelector: string
  starSelector: string
  startYMax?: number
  distMin?: number
  distMax?: number
  twinkleRestOpacity?: number
  shouldSkip?: () => boolean
  deltaMin?: number
  burstDelta?: number
  cooldownBase?: number
  cooldownJitter?: number
}

export type ShootingStarsController = {
  onScroll: (self: ScrollTrigger) => void
  launch: () => void
}

export function createShootingStars({
  root,
  shootSelector,
  starSelector,
  startYMax = 38,
  distMin = 150,
  distMax = 380,
  twinkleRestOpacity = 0.2,
  shouldSkip,
  deltaMin = 0.0012,
  burstDelta = 0.025,
  cooldownBase = 0.028,
  cooldownJitter = 0.05,
}: ShootingStarsOptions): ShootingStarsController {
  const shootEls = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll(shootSelector),
  )
  const twinkleEls = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll(starSelector),
  )

  let shootCursor = 0
  let lastProgress = 0
  let cooldown = 0

  const punchTwinkles = () => {
    if (!twinkleEls.length) return
    const picks = gsap.utils.shuffle(twinkleEls.slice()).slice(0, 2)
    picks.forEach((star) => {
      gsap.fromTo(
        star,
        { opacity: 0.9, scale: 1.6 },
        {
          opacity: twinkleRestOpacity,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
    })
  }

  const launch = () => {
    if (shouldSkip?.()) return

    const el = shootEls[shootCursor % shootEls.length]
    shootCursor += 1
    if (!el || el.dataset.busy === '1') return

    el.dataset.busy = '1'

    const startX = 28 + Math.random() * 72
    const startY = Math.random() * startYMax
    const angle = 128 + Math.random() * 32
    const dist = distMin + Math.random() * (distMax - distMin)
    const len = 40 + Math.random() * 70
    const rad = (angle * Math.PI) / 180

    gsap.killTweensOf(el)
    gsap.set(el, {
      left: `${startX}%`,
      top: `${startY}%`,
      width: len,
      rotation: angle,
      opacity: 0,
      x: 0,
      y: 0,
      scaleX: 1,
    })

    gsap
      .timeline({
        onComplete: () => {
          el.dataset.busy = '0'
          gsap.set(el, { opacity: 0 })
        },
      })
      .to(el, { opacity: 0.95, duration: 0.06 })
      .to(
        el,
        {
          x: Math.cos(rad) * dist,
          y: Math.sin(rad) * dist,
          opacity: 0,
          scaleX: 0.35,
          duration: 0.4 + Math.random() * 0.4,
          ease: 'power1.in',
        },
        0,
      )

    punchTwinkles()
  }

  const onScroll = (self: ScrollTrigger) => {
    if (shouldSkip?.()) return

    const delta = Math.abs(self.progress - lastProgress)
    lastProgress = self.progress
    if (delta < deltaMin) return

    cooldown -= delta
    if (cooldown > 0) return

    const bursts = delta > burstDelta ? 2 : 1
    for (let i = 0; i < bursts; i += 1) {
      if (i > 0 && Math.random() > 0.55) continue
      launch()
    }
    cooldown = cooldownBase + Math.random() * cooldownJitter
  }

  return { onScroll, launch }
}
