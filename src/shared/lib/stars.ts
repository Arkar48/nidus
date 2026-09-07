export type StarSpec = {
  id: number
  left: string
  top: string
  size: number
  delay: string
  duration: string
}

export type StarFieldOptions = {
  leftPrime?: number
  leftOffset?: number
  topPrime?: number
  topOffset?: number
  topMax?: number
  delayStep?: number
  delayMods?: number
  durationBase?: number
  durationStep?: number
  durationMods?: number
}

export function makeStars(
  count: number,
  {
    leftPrime = 53,
    leftOffset = 11,
    topPrime = 37,
    topOffset = 5,
    topMax = 72,
    delayStep = 0.28,
    delayMods = 19,
    durationBase = 1.6,
    durationStep = 0.4,
    durationMods = 6,
  }: StarFieldOptions = {},
): StarSpec[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * leftPrime + leftOffset) % 100}%`,
    top: `${(i * topPrime + topOffset) % topMax}%`,
    size: 1 + (i % 3),
    delay: `${(i % delayMods) * delayStep}s`,
    duration: `${durationBase + (i % durationMods) * durationStep}s`,
  }))
}

export function makeShootPool(count: number) {
  return Array.from({ length: count }, (_, id) => ({ id }))
}
