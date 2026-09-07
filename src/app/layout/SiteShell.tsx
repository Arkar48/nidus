import type { ReactNode } from 'react'
import { Nav } from './Nav'

type Props = {
  ready: boolean
  children: ReactNode
}

export function SiteShell({ ready, children }: Props) {
  return (
    <div
      className={
        ready
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-100'
      }
    >
      <Nav />
      <main>{children}</main>
    </div>
  )
}
