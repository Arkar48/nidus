export type PreloadPriority = 'high' | 'low'

export function preloadImage(
  src: string,
  priority: PreloadPriority = 'high',
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    const finish = () => resolve()

    img.decoding = 'async'
    if ('fetchPriority' in img) {
      ;(img as HTMLImageElement & { fetchPriority: string }).fetchPriority =
        priority
    }

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(finish).catch(finish)
        return
      }
      finish()
    }
    img.onerror = finish
    img.src = src
  })
}

export function preloadImages(
  srcs: readonly string[],
  onProgress?: (ratio: number) => void,
  priority: PreloadPriority = 'high',
): Promise<void> {
  if (srcs.length === 0) {
    onProgress?.(1)
    return Promise.resolve()
  }

  let done = 0
  return Promise.all(
    srcs.map((src) =>
      preloadImage(src, priority).then(() => {
        done += 1
        onProgress?.(done / srcs.length)
      }),
    ),
  ).then(() => undefined)
}

/** Fire-and-forget warm for offscreen media. Yields to idle so it never fights first paint. */
export function warmImages(srcs: readonly string[]) {
  const run = () => void preloadImages(srcs, undefined, 'low')
  const idle = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void) => number
    }
  ).requestIdleCallback

  if (typeof idle === 'function') {
    idle(run)
    return
  }
  window.setTimeout(run, 300)
}

export function waitForElement(
  selector: string,
  timeoutMs = 4000,
): Promise<Element | null> {
  const found = document.querySelector(selector)
  if (found) return Promise.resolve(found)

  return new Promise((resolve) => {
    const done = (el: Element | null) => {
      observer.disconnect()
      window.clearTimeout(timer)
      resolve(el)
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) done(el)
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    const timer = window.setTimeout(
      () => done(document.querySelector(selector)),
      timeoutMs,
    )
  })
}

export function waitForImages(root: ParentNode | null): Promise<void> {
  if (!root) return Promise.resolve()

  const imgs = Array.from(root.querySelectorAll('img'))
  if (imgs.length === 0) return Promise.resolve()

  return Promise.all(
    imgs.map((img) => {
      const decode = () =>
        typeof img.decode === 'function'
          ? img.decode().then(() => undefined).catch(() => undefined)
          : Promise.resolve()

      if (img.complete && img.naturalWidth > 0) return decode()

      return new Promise<void>((resolve) => {
        const done = () => resolve()
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      }).then(decode)
    }),
  ).then(() => undefined)
}
