import { gsap } from 'gsap'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export type ScrambleOptions = {
  duration?: number
  charStagger?: number
  delay?: number
  settleRatio?: number
}

const isSettledChar = (ch: string) =>
  ch === ' ' || ch === '.' || ch === '—' || ch === '/' || ch === '·'

const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

function runScramble(
  el: HTMLElement,
  final: string,
  {
    duration = 0.7,
    charStagger = 0.045,
    delay = 0,
    settleRatio = 0.35,
  }: ScrambleOptions = {},
): () => void {
  const chars = Array.from(final)
  const settled = chars.map(isSettledChar)
  const display = chars.map((ch, i) => (settled[i] ? ch : randGlyph()))

  const paint = () => {
    el.textContent = display.join('')
  }

  paint()

  const flicker = gsap.to(
    {},
    {
      duration: delay + duration + chars.length * charStagger + 0.05,
      ease: 'none',
      onUpdate() {
        let dirty = false
        for (let i = 0; i < chars.length; i += 1) {
          if (settled[i]) continue
          display[i] = randGlyph()
          dirty = true
        }
        if (dirty) paint()
      },
    },
  )

  const settles = chars.map((ch, i) => {
    if (settled[i]) return null
    return gsap.delayedCall(delay + i * charStagger + duration * settleRatio, () => {
      settled[i] = true
      display[i] = ch
      paint()
    })
  })

  return () => {
    flicker.kill()
    settles.forEach((t) => t?.kill())
    el.textContent = final
  }
}

export function scrambleLine(
  el: HTMLElement,
  opts: ScrambleOptions = {},
): () => void {
  return runScramble(el, el.dataset.text ?? el.textContent ?? '', opts)
}

export function scrambleInto(
  el: HTMLElement | null,
  final: string,
  opts: ScrambleOptions = {},
): () => void {
  if (!el) return () => {}
  return runScramble(el, final, { settleRatio: 0.32, ...opts })
}

export function scrambleLines(
  lines: HTMLElement[],
  opts: ScrambleOptions & { lineStagger?: number } = {},
): () => void {
  const { lineStagger = 0.08, delay = 0, ...rest } = opts
  const kills = lines.map((line, i) =>
    scrambleLine(line, { ...rest, delay: delay + i * lineStagger }),
  )
  return () => kills.forEach((kill) => kill())
}
