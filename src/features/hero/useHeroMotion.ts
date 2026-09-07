import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onDebouncedResize, prefersReducedMotion } from '@/shared/lib/motion'
import { scrambleLines } from '@/shared/lib/scrambleText'
import { HERO_LAYERS, MOBILE_MQ, RESIZE_REFRESH_MS } from './constants'
import { setupHeroScroll } from './scrollTimelines'
import { createShootingStars } from './shootingStars'

gsap.registerPlugin(ScrollTrigger)

function setupIntro(root: HTMLElement, reduce: boolean) {
  const killScrambles: Array<() => void> = []
  let hoverKill: (() => void) | null = null
  let introDone = reduce

  gsap.set('.hero__layer--planet', { autoAlpha: 1, x: 0, y: 0, scale: 1 })

  gsap.from('.hero__layer--planet .hero__layer-shift', {
    y: 40,
    scale: 0.92,
    duration: reduce ? 0.01 : 1.1,
    ease: 'power4.out',
    delay: 0.05,
  })
  gsap.from('.hero__layer--land', {
    y: 90,
    opacity: 0,
    duration: reduce ? 0.01 : 1,
    ease: 'power4.out',
    delay: 0.2,
  })

  const titleLines = gsap.utils.toArray<HTMLElement>('.hero__line')
  const titleEl = root.querySelector<HTMLElement>('.hero__title')

  const runTitleScramble = (
    opts: { delay?: number; duration?: number; charStagger?: number } = {},
  ) => {
    killScrambles.splice(0).forEach((kill) => kill())
    hoverKill?.()
    hoverKill = null

    const kill = scrambleLines(titleLines, {
      delay: opts.delay ?? 0,
      duration: opts.duration ?? 0.45,
      charStagger: opts.charStagger ?? 0.04,
      lineStagger: 0.08,
    })
    killScrambles.push(kill)
    return kill
  }

  if (reduce) {
    titleLines.forEach((line) => {
      line.textContent = line.dataset.text ?? line.textContent
    })
  } else {
    runTitleScramble({ delay: 0.22, duration: 0.55, charStagger: 0.05 })
    gsap.delayedCall(1.4, () => {
      introDone = true
    })
  }

  const onTitleEnter = () => {
    if (reduce || !introDone) return
    hoverKill = runTitleScramble({
      delay: 0,
      duration: 0.38,
      charStagger: 0.032,
    })
  }

  titleEl?.addEventListener('pointerenter', onTitleEnter)

  gsap.from('.hero__copy, .hero__cta', {
    y: 16,
    opacity: 0,
    duration: reduce ? 0.01 : 0.65,
    stagger: 0.08,
    ease: 'power3.out',
    delay: reduce ? 0 : 0.95,
  })

  return () => {
    titleEl?.removeEventListener('pointerenter', onTitleEnter)
    hoverKill?.()
    killScrambles.forEach((kill) => kill())
  }
}

function setupMouseParallax(
  root: HTMLElement,
  shifts: NodeListOf<HTMLElement>,
  planet: HTMLElement | null,
  reduce: boolean,
) {
  const onMove = (e: MouseEvent) => {
    if (reduce) return
    if (window.matchMedia(MOBILE_MQ).matches) return
    if (planet && Number(gsap.getProperty(planet, 'opacity')) < 0.85) return

    const r = root.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5

    shifts.forEach((el, i) => {
      const layer = HERO_LAYERS[i]
      if (!layer || layer.id === 'planet') return

      gsap.to(el, {
        x: nx * 80 * layer.depth,
        y: ny * 36 * layer.depth,
        duration: 1.1,
        overwrite: 'auto',
        ease: 'power2.out',
      })
    })
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  return () => window.removeEventListener('mousemove', onMove)
}

function refreshWhenImagesReady(root: HTMLElement) {
  const refresh = () => ScrollTrigger.refresh()
  root.querySelectorAll<HTMLImageElement>('.hero__layer img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true })
  })
  requestAnimationFrame(refresh)
}

export function useHeroMotion(
  rootRef: RefObject<HTMLElement | null>,
  active = true,
) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return

    const reduce = prefersReducedMotion()
    const shifts = root.querySelectorAll<HTMLElement>('.hero__layer-shift')
    const planet = root.querySelector<HTMLElement>('.hero__layer--planet')

    let disposeIntro: () => void = () => {}

    const ctx = gsap.context(() => {
      disposeIntro = setupIntro(root, reduce)

      if (!reduce) {
        const { onScroll } = createShootingStars(root)
        setupHeroScroll(root, onScroll)
      }

      refreshWhenImagesReady(root)
    }, root)

    const removeParallax = setupMouseParallax(root, shifts, planet, reduce)
    const removeResize = onDebouncedResize(
      () => ScrollTrigger.refresh(),
      RESIZE_REFRESH_MS,
    )

    return () => {
      removeParallax()
      removeResize()
      disposeIntro()
      ctx.revert()
    }
  }, [rootRef, active])
}
