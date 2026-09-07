import { SPACE_SHOTS } from '@/content/space/shots'
import { HERO_LAYERS } from '@/features/hero/constants'

export type LoaderProps = {
  onReveal: () => void
  onComplete: () => void
}

export const STATUS_BEATS = [
  'warming the nest',
  'loading frames',
  'syncing the keep',
  'opening',
] as const

/** Floor, so a warm cache doesn't flash the loader for 90ms. */
export const MIN_GATE_MS = 2400
export const MIN_GATE_REDUCED_MS = 900

/** The gate blocks on these — nothing is painted until they decode. */
export const GATE_ASSETS = Array.from(
  new Set(HERO_LAYERS.map((layer) => layer.src)),
)

/** Warmed at low priority once the gate lifts; the collection is a scroll away. */
export const DEFERRED_ASSETS = Array.from(
  new Set(SPACE_SHOTS.map((shot) => shot.src)),
).filter((src) => !GATE_ASSETS.includes(src))
