import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/shared/lib/motion'
import { startLenis, stopLenis } from '@/shared/lib/lenisBridge'
import { createShootingStars } from '@/shared/lib/shootingStars'
import { createRailPainter } from './railPainter'
import { setupGalleryScroll } from './scrollTimelines'

gsap.registerPlugin(ScrollTrigger)

const DETAIL_SCROLL_LOCK_MQ = '(max-width: 960px)'

function isCompactViewport() {
  return window.matchMedia(DETAIL_SCROLL_LOCK_MQ).matches
}

function lockPageScroll() {
  const html = document.documentElement
  const { body } = document
  const scrollY = window.scrollY

  html.classList.add('is-scroll-locked')
  body.classList.add('is-scroll-locked')
  body.dataset.scrollLockY = String(scrollY)
  body.style.top = `-${scrollY}px`

  stopLenis()
}

function unlockPageScroll() {
  const html = document.documentElement
  const { body } = document
  const y = Number(body.dataset.scrollLockY || '0')

  html.classList.remove('is-scroll-locked')
  body.classList.remove('is-scroll-locked')
  body.style.top = ''
  delete body.dataset.scrollLockY

  window.scrollTo(0, y)
  startLenis()
}

export function useGalleryMotion(
  rootRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return

    const reduce = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduce) {
        createRailPainter(stage).paint(0)
        return
      }

      setupGalleryScroll({ root, stage })

      const stars = createShootingStars({
        root,
        shootSelector: '.gallery__shoot',
        starSelector: '.gallery__star',
        startYMax: 55,
        distMin: 160,
        distMax: 420,
        twinkleRestOpacity: 0.25,
        shouldSkip: () => root.dataset.detail === 'open',
        deltaMin: 0.001,
        burstDelta: 0.02,
        cooldownBase: 0.025,
        cooldownJitter: 0.045,
      })

      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: stars.onScroll,
      })
    }, root)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [rootRef, stageRef])
}

export function useGalleryDetailLock(
  rootRef: RefObject<HTMLElement | null>,
  active: unknown,
  onClose: () => void,
) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.dataset.detail = active ? 'open' : ''
    if (!active) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    let locked = false

    const syncLock = () => {
      const shouldLock = isCompactViewport()
      if (shouldLock && !locked) {
        lockPageScroll()
        locked = true
      } else if (!shouldLock && locked) {
        unlockPageScroll()
        locked = false
      }
    }

    const blockTouchScroll = (e: TouchEvent) => {
      if (!locked) return
      e.preventDefault()
    }

    const blockWheel = (e: WheelEvent) => {
      if (!locked) return
      e.preventDefault()
    }

    syncLock()
    const mq = window.matchMedia(DETAIL_SCROLL_LOCK_MQ)
    mq.addEventListener('change', syncLock)
    document.addEventListener('touchmove', blockTouchScroll, { passive: false })
    document.addEventListener('wheel', blockWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', syncLock)
      document.removeEventListener('touchmove', blockTouchScroll)
      document.removeEventListener('wheel', blockWheel)
      if (locked) unlockPageScroll()
    }
  }, [active, onClose, rootRef])
}
