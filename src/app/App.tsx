import { Gallery } from '@/features/gallery'
import { Hero } from '@/features/hero'
import { Loader } from '@/features/loader'
import { useLenis } from '@/shared/hooks'
import { useAppBoot } from './hooks/useAppBoot'
import { SiteShell } from './layout'

export default function App() {
  const { showApp, ready, reveal, complete } = useAppBoot()

  useLenis(ready)

  return (
    <>
      {showApp && (
        <SiteShell ready={ready}>
          <Hero />
          <Gallery />
        </SiteShell>
      )}
      {!ready && <Loader onReveal={reveal} onComplete={complete} />}
    </>
  )
}
