export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Always returns 0..-width, so rails wrap instead of running off. */
export function wrapNeg(offset: number, width: number) {
  if (width <= 0) return 0
  return -(((offset % width) + width) % width)
}

export function onDebouncedResize(fn: () => void, ms = 180) {
  let timer = 0
  const onResize = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(fn, ms)
  }
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('resize', onResize)
    window.clearTimeout(timer)
  }
}
