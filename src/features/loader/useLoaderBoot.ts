import { useEffect, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/shared/lib/motion'
import {
  preloadImages,
  waitForElement,
  waitForImages,
  warmImages,
} from '@/shared/lib/preload'
import { scrambleInto } from '@/shared/lib/scrambleText'
import {
  MIN_GATE_MS,
  MIN_GATE_REDUCED_MS,
  STATUS_BEATS,
  DEFERRED_ASSETS,
  GATE_ASSETS,
  type LoaderProps,
} from './constants'

type Refs = {
  rootRef: RefObject<HTMLDivElement | null>
  brandRef: RefObject<HTMLParagraphElement | null>
  statusRef: RefObject<HTMLParagraphElement | null>
}

export function useLoaderBoot(
  { onReveal, onComplete }: LoaderProps,
  refs: Refs,
) {
  // Refs are stable; the wrapper object is not. Depend on the refs themselves.
  const { rootRef, brandRef, statusRef } = refs
  const [progress, setProgress] = useState(0)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    if (!statusRef.current) return
    const label = STATUS_BEATS[beat] ?? STATUS_BEATS[0]
    return scrambleInto(statusRef.current, label, {
      duration: 0.32,
      charStagger: 0.025,
    })
  }, [beat, statusRef])

  useEffect(() => {
    const reduce = prefersReducedMotion()
    const minMs = reduce ? MIN_GATE_REDUCED_MS : MIN_GATE_MS
    let cancelled = false
    let exiting = false
    let raf = 0
    const cleanups: Array<() => void> = []
    const startedAt = performance.now()
    let assetRatio = 0
    let assetsReady = false

    onReveal()

    cleanups.push(
      scrambleInto(brandRef.current, 'NIDUS', {
        delay: 0.1,
        duration: 0.65,
        charStagger: 0.06,
      }),
    )

    void (async () => {
      await preloadImages(GATE_ASSETS, (ratio) => {
        if (cancelled) return
        assetRatio = ratio
      })
      if (cancelled) return

      const hero = await waitForElement('.hero')
      if (cancelled) return
      await waitForImages(hero)
      if (cancelled) return

      assetsReady = true
      assetRatio = 1

      // Collection is a scroll away — warm it behind the gate, never block on it.
      warmImages(DEFERRED_ASSETS)
    })()

    const runExit = () => {
      if (exiting) return
      exiting = true

      const root = rootRef.current
      if (!root) {
        onComplete()
        return
      }

      if (reduce) {
        gsap.to(root, { opacity: 0, duration: 0.25, onComplete })
        return
      }

      gsap.to(root, {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete,
      })
    }

    const tick = (now: number) => {
      if (cancelled || exiting) return

      const elapsedMs = now - startedAt
      const timeRatio = Math.min(1, elapsedMs / minMs)
      const raw = assetsReady
        ? Math.min(1, Math.max(timeRatio, assetRatio))
        : Math.min(0.96, Math.max(timeRatio * 0.9, assetRatio * 0.88))

      const pct = Math.floor(raw * 100)
      setProgress(pct)
      setBeat(Math.min(STATUS_BEATS.length - 1, Math.floor(raw * STATUS_BEATS.length)))

      if (!assetsReady || elapsedMs < minMs) {
        raf = requestAnimationFrame(tick)
        return
      }

      setProgress(100)
      setBeat(STATUS_BEATS.length - 1)
      runExit()
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [onComplete, onReveal, brandRef, rootRef])

  return { progress }
}
