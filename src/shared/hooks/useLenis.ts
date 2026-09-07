import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onDebouncedResize, prefersReducedMotion } from '@/shared/lib'
import { registerLenis } from '@/shared/lib/lenisBridge'

gsap.registerPlugin(ScrollTrigger)

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    registerLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const removeResize = onDebouncedResize(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    })

    return () => {
      removeResize()
      gsap.ticker.remove(tick)
      registerLenis(null)
      lenis.destroy()
    }
  }, [enabled])
}
