export type HeroLayer = {
  id: 'planet' | 'moon-land'
  src: string
  className: string
  depth: number
  scrollY: number
}

export const HERO_LAYERS: readonly HeroLayer[] = [
  {
    id: 'planet',
    src: '/parallax/planet.png',
    className: 'hero__layer hero__layer--planet',
    depth: 0.2,
    scrollY: -40,
  },
  {
    id: 'moon-land',
    src: '/parallax/moon-land.png',
    className: 'hero__layer hero__layer--land',
    depth: 0.55,
    scrollY: -110,
  },
] as const

export const TITLE_LINES = ['Enter the keep.'] as const

export const SHOOT_POOL_SIZE = 10
export const STAR_COUNT = 64
export const DESKTOP_MQ = '(min-width: 961px)'
export const MOBILE_MQ = '(max-width: 960px)'
export const RESIZE_REFRESH_MS = 180
