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

export const MIN_GATE_MS = 3200
export const MIN_GATE_REDUCED_MS = 900

export const CRITICAL_ASSETS = Array.from(
  new Set([
    ...HERO_LAYERS.map((layer) => layer.src),
    ...SPACE_SHOTS.map((shot) => shot.src),
    '/space/nebula-1.jpg',
    '/parallax/planet.png',
  ]),
)

export const TOTAL_ASSETS = CRITICAL_ASSETS.length
