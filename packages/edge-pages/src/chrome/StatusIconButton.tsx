import type { ReactNode } from 'react'
import styled from 'styled-components'
import { IconButton } from '@ingradient/ui/components'

export type StatusIconTone = 'success' | 'warning' | 'danger' | 'neutral'

const TONE_COLOR: Record<StatusIconTone, string> = {
  success: 'var(--ig-color-success)',
  warning: 'var(--ig-color-warning)',
  danger: 'var(--ig-color-danger)',
  neutral: 'var(--ig-color-text-muted)',
}

const Trigger = styled(IconButton)`
  position: relative;
`

const Dot = styled.span<{ $tone: StatusIconTone }>`
  position: absolute;
  right: var(--ig-spacing-4);
  bottom: var(--ig-spacing-4);
  width: var(--ig-size-dot-sm);
  height: var(--ig-size-dot-sm);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => TONE_COLOR[p.$tone]};
  /* Ring in the bar colour separates the dot from the icon stroke. */
  box-shadow: 0 0 0 var(--ig-border-2px) var(--ig-color-surface-header);
`

export interface StatusIconButtonProps {
  icon: ReactNode
  tone: StatusIconTone
  /** Status sentence; used as accessible name and tooltip (e.g. "Camera connected: Crevis 01"). */
  label: string
  onClick?: () => void
}

/** Top-bar status: a device icon with a status dot in its corner. Clicking opens the related settings. */
export function StatusIconButton({ icon, tone, label, onClick }: StatusIconButtonProps): JSX.Element {
  return (
    <Trigger variant="secondary" size="sm" title={label} aria-label={label} onClick={onClick} disabled={!onClick}
      data-status-tone={tone}>
      {icon}
      <Dot $tone={tone} aria-hidden="true" />
    </Trigger>
  )
}
