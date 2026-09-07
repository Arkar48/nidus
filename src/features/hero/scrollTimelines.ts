import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_LAYERS } from './constants'
import { planetNearGroundY, planetXAt, resetHeroLayers } from './planetGeometry'

type TimelineOptions = {
  root: HTMLElement
  onScrollStars: (self: ScrollTrigger) => void
}

function createDesktopTimeline({ root, onScrollStars }: TimelineOptions) {
  resetHeroLayers()

  const landScrollY = HERO_LAYERS[1].scrollY
  const planet = root.querySelector<HTMLElement>('.hero__layer--planet')

  // Transforms create stacking contexts, so pin z-index up front.
  gsap.set('.hero__layer--planet', { zIndex: 1 })
  gsap.set('.hero__layer--land', { zIndex: 5 })

  const tl = gsap.timeline()

  // Act 1 — settle
  tl.to(
    '.hero__copyblock',
    { y: -28, opacity: 0, ease: 'none', duration: 0.28 },
    0.08,
  )
    .to('.hero__layer--land', { y: landScrollY * 0.35, ease: 'none', duration: 0.4 }, 0)
    .fromTo(
      '.hero__layer--planet',
      { x: 0, y: 0, scale: 1, autoAlpha: 1 },
      {
        x: () => planetXAt(root, planet, 0.42),
        y: '18vh',
        scale: 1.35,
        autoAlpha: 1,
        ease: 'none',
        duration: 0.4,
        immediateRender: false,
      },
      0.05,
    )

    // Act 2 — descend
    .to(
      '.hero__layer--planet',
      {
        x: () => planetXAt(root, planet, 0.28),
        y: '48vh',
        scale: 1.9,
        autoAlpha: 1,
        ease: 'none',
        duration: 0.38,
      },
      0.45,
    )
    .to(
      '.hero__layer--land',
      { y: landScrollY, ease: 'none', duration: 0.38 },
      0.45,
    )

    // Act 3 — dissolve late, so the art holds through most of the pin
    .to(
      '.hero__layer--planet',
      {
        x: () => planetXAt(root, planet, 0.16),
        y: '78vh',
        scale: 2.25,
        autoAlpha: 0,
        ease: 'none',
        duration: 0.2,
      },
      0.82,
    )
    .to(
      '.hero__layer--land',
      { y: landScrollY - 56, autoAlpha: 0, ease: 'none', duration: 0.18 },
      0.84,
    )
    .to('.hero__fade', { opacity: 1, ease: 'none', duration: 0.16 }, 0.86)
    .to('.hero__stars', { opacity: 0.4, ease: 'none', duration: 0.14 }, 0.88)

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: '+=118%',
    pin: true,
    pinSpacing: true,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onUpdate: onScrollStars,
  })

  return resetHeroLayers
}

function createMobileTimeline({ root, onScrollStars }: TimelineOptions) {
  resetHeroLayers()

  const planet = root.querySelector<HTMLElement>('.hero__layer--planet')

  gsap.set('.hero__layer--planet', { zIndex: 1 })
  gsap.set('.hero__layer--land', { zIndex: 5 })

  const tl = gsap.timeline()
  tl.to('.hero__copyblock', { opacity: 0, y: -20, ease: 'none', duration: 0.28 }, 0.06)
    .fromTo(
      '.hero__layer--planet',
      { x: 0, y: 0, scale: 1, autoAlpha: 1 },
      {
        x: () => planetXAt(root, planet, 0.5),
        y: () => planetNearGroundY(root, planet, 0.45) * 0.35,
        scale: 1.28,
        autoAlpha: 1,
        ease: 'none',
        duration: 0.4,
        immediateRender: false,
      },
      0.04,
    )
    .to(
      '.hero__layer--planet',
      {
        x: () => planetXAt(root, planet, 0.38),
        y: () => planetNearGroundY(root, planet, 0.42),
        scale: 1.5,
        autoAlpha: 1,
        ease: 'none',
        duration: 0.36,
      },
      0.44,
    )
    .to(
      '.hero__layer--planet',
      {
        x: () => planetXAt(root, planet, 0.28),
        y: () => planetNearGroundY(root, planet, 0.28),
        scale: 1.62,
        autoAlpha: 0,
        ease: 'none',
        duration: 0.28,
      },
      0.8,
    )
    .to(
      '.hero__layer--land',
      { y: 36, autoAlpha: 0, ease: 'none', duration: 0.3 },
      0.82,
    )
    .to('.hero__fade', { opacity: 1, ease: 'none', duration: 0.24 }, 0.88)

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: '+=210%',
    pin: true,
    pinSpacing: true,
    scrub: 1,
    animation: tl,
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onUpdate: onScrollStars,
  })

  requestAnimationFrame(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return resetHeroLayers
}

export function setupHeroScroll(root: HTMLElement, onScrollStars: (self: ScrollTrigger) => void) {
  const mm = gsap.matchMedia()
  const opts = { root, onScrollStars }

  mm.add('(min-width: 961px)', () => createDesktopTimeline(opts))
  mm.add('(max-width: 960px)', () => createMobileTimeline(opts))

  return mm
}
