import { createShootingStars as createShared } from '@/shared/lib/shootingStars'

export function createShootingStars(root: HTMLElement) {
  return createShared({
    root,
    shootSelector: '.hero__shoot',
    starSelector: '.hero__star',
  })
}
