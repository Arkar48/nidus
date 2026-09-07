import type Lenis from '@studio-freight/lenis'

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

export function stopLenis() {
  lenis?.stop()
}

export function startLenis() {
  lenis?.start()
}
