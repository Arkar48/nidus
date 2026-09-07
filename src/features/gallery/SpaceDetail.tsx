import { AnimatePresence, motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { SpaceShot } from '@/content/space'
import { TraitChip } from './TraitChip'

type Props = {
  shot: SpaceShot | null
  onClose: () => void
}

const KEEP_SELECTOR = '[data-detail-keep]'

const traitListVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.18,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
}

const traitItemVariants = {
  hidden: { opacity: 0, x: 72 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    x: 48,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
}

export function SpaceDetail({ shot, onClose }: Props) {
  const dismissUnlessKeep = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.closest(KEEP_SELECTOR)) return
    onClose()
  }

  return createPortal(
    <AnimatePresence>
      {shot && (
        <motion.div
          className="space-detail fixed inset-0 z-[60] grid cursor-pointer place-items-center content-center overflow-y-auto overscroll-contain px-[6vw] py-[6vh] max-sm:px-[5vw] max-sm:py-[4vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={dismissUnlessKeep}
        >
          <div
            className="space-detail__scrim pointer-events-none absolute inset-0 border-0 bg-scrim"
            aria-hidden="true"
          />

          <div
            className="space-detail__panel pointer-events-none relative z-1 grid w-[min(960px,100%)] grid-cols-[minmax(220px,38vw)_minmax(220px,340px)] items-center gap-[clamp(24px,4vw,56px)] max-sm:grid-cols-1 max-sm:justify-items-center max-sm:gap-[22px]"
            role="dialog"
            aria-modal="true"
            aria-label={shot.name}
          >
            <motion.div
              className="space-detail__card pointer-events-auto aspect-square w-[min(100%,420px)] cursor-default overflow-hidden rounded-[28px] shadow-[0_30px_80px_var(--shadow-deep)] origin-center max-sm:w-[min(72vw,280px)] max-sm:rounded-[22px]"
              data-detail-keep
              initial={{ opacity: 0, scale: 0.72, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              exit={{ opacity: 0, scale: 0.85, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <img
                src={shot.src}
                alt=""
                draggable={false}
                className="block size-full object-cover"
              />
            </motion.div>

            <div className="space-detail__meta text-paper max-sm:w-[min(100%,360px)]">
              <motion.div
                className="space-detail__heading mb-[22px] flex items-baseline justify-between gap-4"
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.35,
                  delay: 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3
                  data-detail-keep
                  className="pointer-events-auto cursor-default font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-bold tracking-[-0.03em]"
                >
                  {shot.name}
                </h3>
                <button
                  type="button"
                  className="space-detail__close pointer-events-auto cursor-pointer border-0 bg-transparent py-2 text-[0.68rem] uppercase tracking-[0.14em] text-mist-warm hover:text-paper"
                  onClick={onClose}
                >
                  Close
                </button>
              </motion.div>

              <motion.ul
                className="space-detail__traits pointer-events-auto grid list-none grid-cols-2 gap-2.5 overflow-visible"
                data-detail-keep
                variants={traitListVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {shot.traits.map((trait) => (
                  <motion.li
                    key={trait.label}
                    variants={traitItemVariants}
                    className="last:odd:col-span-full last:odd:w-[min(100%,220px)] last:odd:justify-self-center"
                  >
                    <TraitChip label={trait.label} value={trait.value} />
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
