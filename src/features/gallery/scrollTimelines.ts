import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createRailPainter } from './railPainter'

type Options = {
  root: HTMLElement
  stage: HTMLElement
}

export function setupGalleryScroll({ root, stage }: Options) {
  const { paint } = createRailPainter(stage)
  const isDetailOpen = () => root.dataset.detail === 'open'

  const onScrub = (self: ScrollTrigger) => {
    if (isDetailOpen()) return
    paint(self.progress)
  }

  paint(0)
  gsap.set('.gallery__inner', { autoAlpha: 0, y: 72 })

  const mmReveal = gsap.matchMedia()

  mmReveal.add('(min-width: 961px)', () => {
    gsap.fromTo(
      '.gallery__inner',
      { autoAlpha: 0, y: 48 },
      {
        autoAlpha: 1,
        y: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'top 58%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    )
  })

  mmReveal.add('(max-width: 960px)', () => {
    gsap.fromTo(
      '.gallery__inner',
      { autoAlpha: 0, y: 72 },
      {
        autoAlpha: 1,
        y: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          end: 'top 32%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      },
    )
  })

  const mm = gsap.matchMedia()

  mm.add('(min-width: 961px)', () => {
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=320%',
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onRefresh: onScrub,
      onUpdate: onScrub,
    })
  })

  mm.add('(max-width: 960px)', () => {
    paint(0)
    ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      end: 'bottom top',
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: onScrub,
      onUpdate: onScrub,
    })
  })

  return { paint }
}
