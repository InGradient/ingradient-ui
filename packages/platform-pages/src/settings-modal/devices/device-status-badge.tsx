import type { ReactNode } from 'react'
import { Badge } from '@ingradient/ui/components'

export type DeviceStatusTone = 'active' | 'revoked' | 'pending' | 'expired' | 'soon' | 'ok'

const TONE_TO_BADGE: Record<DeviceStatusTone, 'success' | 'danger' | 'warning'> = {
  active: 'success',
  ok: 'success',
  revoked: 'danger',
  expired: 'danger',
  pending: 'warning',
  soon: 'warning',
}

export interface DeviceStatusBadgeProps {
  tone: DeviceStatusTone
  children: ReactNode
  className?: string
}

/**
 * Device status pill — maps 6 device-specific tones onto the generic Badge palette
 * (success / danger / warning). 시각 표준 Badge 사용; 도메인 라벨링은 caller 가
 * children 으로 결정한다.
 */
export function DeviceStatusBadge({ tone, children, className }: DeviceStatusBadgeProps) {
  return (
    <Badge $tone={TONE_TO_BADGE[tone]} className={className}>
      {children}
    </Badge>
  )
}
