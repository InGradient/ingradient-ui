import styled from 'styled-components'

export type DeviceStatusTone = 'active' | 'revoked' | 'pending' | 'expired' | 'soon' | 'ok'

const toneStyles = {
  active: 'background: var(--ig-color-status-running-bg); color: var(--ig-color-status-running-text);',
  ok: 'background: var(--ig-color-status-running-bg); color: var(--ig-color-status-running-text);',
  revoked: 'background: var(--ig-color-status-failed-bg); color: var(--ig-color-status-failed-text);',
  expired: 'background: var(--ig-color-status-failed-bg); color: var(--ig-color-status-failed-text);',
  pending: 'background: var(--ig-color-status-warning-bg); color: var(--ig-color-status-warning-text);',
  soon: 'background: var(--ig-color-status-warning-bg); color: var(--ig-color-status-warning-text);',
}

const Badge = styled.span<{ $tone: DeviceStatusTone }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: var(--ig-radius-4xl);
  font-size: 11px;
  font-weight: 600;
  ${(p) => toneStyles[p.$tone]}
`

export interface DeviceStatusBadgeProps {
  tone: DeviceStatusTone
  children: React.ReactNode
  className?: string
}

export function DeviceStatusBadge({ tone, children, className }: DeviceStatusBadgeProps) {
  return <Badge $tone={tone} className={className}>{children}</Badge>
}
