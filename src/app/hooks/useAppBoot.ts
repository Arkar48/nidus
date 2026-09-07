import { useCallback, useEffect, useState } from 'react'

export function useAppBoot() {
  const [showApp, setShowApp] = useState(false)
  const [ready, setReady] = useState(false)

  const reveal = useCallback(() => setShowApp(true), [])
  const complete = useCallback(() => setReady(true), [])

  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready)
    return () => document.body.classList.remove('is-loading')
  }, [ready])

  return {
    showApp,
    ready,
    reveal,
    complete,
  }
}
