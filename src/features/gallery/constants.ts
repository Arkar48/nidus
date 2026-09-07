import {
  SPACE_SHOTS,
  SPACE_SHOTS_B,
  SPACE_SHOTS_C,
  SPACE_SHOTS_D,
  type SpaceShot,
} from '@/content/space'

export type RailShot = SpaceShot & { key: string }

export type RailConfig = {
  id: string
  shots: SpaceShot[]
  extra?: boolean
}

export const SHOOT_POOL_SIZE = 10
export const STAR_COUNT = 56
export const LOOPS = 3

export const GALLERY_STAR_FIELD = {
  leftPrime: 47,
  leftOffset: 13,
  topPrime: 31,
  topOffset: 7,
  topMax: 100,
  delayStep: 0.35,
  delayMods: 17,
  durationBase: 1.8,
  durationStep: 0.45,
  durationMods: 5,
} as const

export const RAIL_CONFIG: RailConfig[] = [
  { id: 'a', shots: SPACE_SHOTS },
  { id: 'b', shots: SPACE_SHOTS_B },
  { id: 'c', shots: SPACE_SHOTS_C, extra: true },
  { id: 'd', shots: SPACE_SHOTS_D, extra: true },
]

export const STAGGER_FACTORS = [0, 0.42, 0.2, 0.58] as const

export function repeatShots(
  shots: SpaceShot[],
  times: number,
  railId: string,
): RailShot[] {
  return Array.from({ length: times }, (_, loop) =>
    shots.map((shot) => ({ ...shot, key: `${railId}-${shot.id}-${loop}` })),
  ).flat()
}

export function buildRails() {
  return RAIL_CONFIG.map((rail) => ({
    ...rail,
    items: repeatShots(rail.shots, LOOPS, rail.id),
  }))
}
