import { gsap } from 'gsap'

export function planetXAt(root: HTMLElement, planet: HTMLElement | null, ratio: number) {
  if (!planet) return 0

  const prevX = Number(gsap.getProperty(planet, 'x')) || 0
  gsap.set(planet, { x: 0 })

  const stage = root.getBoundingClientRect()
  const box = planet.getBoundingClientRect()
  const target = stage.left + stage.width * ratio
  const delta = target - (box.left + box.width / 2)

  gsap.set(planet, { x: prevX })
  return delta
}

export function planetNearGroundY(
  root: HTMLElement,
  planet: HTMLElement | null,
  overlap = 0.45,
) {
  if (!planet) return 0

  const land = root.querySelector<HTMLElement>('.hero__layer--land')
  const prevY = Number(gsap.getProperty(planet, 'y')) || 0
  gsap.set(planet, { y: 0 })

  const stage = root.getBoundingClientRect()
  const box = planet.getBoundingClientRect()
  const landBox = land?.getBoundingClientRect()
  const targetTop = landBox
    ? landBox.top - stage.top - box.height * overlap
    : stage.height * 0.52
  const currentTop = box.top - stage.top
  const delta = targetTop - currentTop

  gsap.set(planet, { y: prevY })
  return delta
}

export function resetHeroLayers() {
  gsap.set('.hero__layer--planet', {
    x: 0,
    y: 0,
    scale: 1,
    autoAlpha: 1,
  })
  gsap.set('.hero__layer--land', {
    x: 0,
    y: 0,
    autoAlpha: 1,
  })
  gsap.set('.hero__layer--land .hero__layer-shift', { x: 0, y: 0 })
  gsap.set('.hero__copyblock', { y: 0, opacity: 1 })
}
