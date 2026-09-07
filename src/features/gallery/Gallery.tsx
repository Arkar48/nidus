import { useCallback, useMemo, useRef, useState } from 'react'
import { SPACE_SHOTS, type SpaceShot } from '@/content/space'
import { makeShootPool, makeStars } from '@/shared/lib/stars'
import { StarField } from '@/shared/ui'
import {
  GALLERY_STAR_FIELD,
  SHOOT_POOL_SIZE,
  STAR_COUNT,
  buildRails,
} from './constants'
import { SpaceDetail } from './SpaceDetail'
import { useGalleryDetailLock, useGalleryMotion } from './useGalleryMotion'

export function Gallery() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<SpaceShot | null>(null)

  const stars = useMemo(() => makeStars(STAR_COUNT, GALLERY_STAR_FIELD), [])
  const shoots = useMemo(() => makeShootPool(SHOOT_POOL_SIZE), [])
  const rails = useMemo(() => buildRails(), [])
  const close = useCallback(() => setActive(null), [])

  useGalleryMotion(rootRef, stageRef)
  useGalleryDetailLock(rootRef, active, close)

  return (
    <section
      ref={rootRef}
      className="gallery relative -mt-[6vh] min-h-svh overflow-hidden bg-void py-[72px] pb-20 text-paper max-[960px]:mt-[-1px] max-[960px]:min-h-0 max-[960px]:py-10 max-[960px]:pb-6 max-sm:py-8 max-sm:pb-4"
      id="gallery"
    >
      <StarField
        stars={stars}
        shoots={shoots}
        className="gallery__stars pointer-events-none absolute inset-0 z-0"
        starClassName="gallery__star"
        shootClassName="gallery__shoot"
      />

      <div className="gallery__inner relative z-1 px-[6vw] will-change-[transform,opacity] max-sm:px-[5vw]">
        <div className="gallery__top mb-7 flex items-end justify-between gap-6 max-sm:mb-3.5">
          <div>
            <p className="gallery__index mb-2 text-[0.68rem] uppercase tracking-[0.22em] text-mist">
              view collection
            </p>
            <h2 className="gallery__title font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.9] font-bold tracking-[-0.03em] text-paper">
              The nest
            </h2>
          </div>
          <p className="gallery__count text-[0.78rem] tracking-[0.12em] text-mist-warm">
            {String(SPACE_SHOTS.length).padStart(2, '0')} frames
          </p>
        </div>

        <div
          ref={stageRef}
          className={`gallery__stage flex w-screen flex-col gap-2 overflow-hidden py-2 pb-6 ml-[calc(50%-50vw)] max-[960px]:gap-1.5 max-[960px]:py-1 max-[960px]:pb-0 max-sm:gap-1.5 max-sm:py-0.5 max-sm:pb-0${active ? ' is-dimmed pointer-events-none opacity-[0.28] transition-opacity duration-300' : ''}`}
        >
          {rails.map((rail) => (
            <div
              key={rail.id}
              className={`gallery__rail gallery__rail--${rail.id} flex w-max gap-2 will-change-transform max-[960px]:gap-1.5${
                rail.extra ? ' gallery__rail--extra hidden max-[960px]:flex' : ''
              }`}
            >
              {rail.items.map((shot) => (
                <button
                  key={shot.key}
                  type="button"
                  className="space-card group relative z-1 aspect-square w-[min(26vw,260px)] shrink-0 cursor-pointer overflow-hidden rounded-[18px] border-0 bg-void-soft p-0 [transform:translateZ(0)] max-[960px]:w-[min(28vw,180px)] max-[960px]:rounded-[14px] max-sm:w-[min(34vw,148px)] max-sm:rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pink-focus"
                  aria-label={`Open ${shot.name}`}
                  onClick={() => setActive(shot)}
                >
                  <img
                    src={shot.src}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    className="space-card__img pointer-events-none block size-full object-cover select-none"
                  />
                  <span
                    className="space-card__glow pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <SpaceDetail shot={active} onClose={close} />
    </section>
  )
}
