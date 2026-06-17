import type { ReactNode } from 'react'
import { CapturingStatusPill } from './WorkspaceView.styles'

interface CapturingPillProps {
  children: ReactNode
}

export function CapturingPill({ children }: CapturingPillProps): JSX.Element {
  return <CapturingStatusPill>{children}</CapturingStatusPill>
}
