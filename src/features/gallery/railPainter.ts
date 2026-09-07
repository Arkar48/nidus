import { gsap } from 'gsap'
import { wrapNeg } from '@/shared/lib/motion'
import { LOOPS, STAGGER_FACTORS } from './constants'

export function createRailPainter(stage: HTMLElement) {
  const getRails = () =>
    gsap.utils
      .toArray<HTMLElement>('.gallery__rail', stage)
      .filter((rail) => getComputedStyle(rail).display !== 'none')

  const primary = () => getRails()[0]

  const loopWidth = () => {
    const rail = primary()
    return rail ? rail.scrollWidth / LOOPS : 0
  }

  const slotSpan = () => {
    const rail = primary()
    const card = rail?.querySelector<HTMLElement>('.space-card')
    if (!rail || !card) return 140
    const styles = getComputedStyle(rail)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '8') || 8
    return card.offsetWidth + gap
  }

  const paint = (progress: number) => {
    const w = loopWidth()
    if (w <= 0) return

    const travel = progress * w * 0.7
    const slot = slotSpan()

    getRails().forEach((rail, i) => {
      const phase = slot * (STAGGER_FACTORS[i] ?? 0.3)
      const x =
        i % 2 === 0
          ? wrapNeg(travel + phase, w)
          : wrapNeg(-(travel + phase), w)
      gsap.set(rail, { x })
    })
  }

  return { paint }
}
