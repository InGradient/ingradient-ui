import React from 'react'

import {
  AlertTriangleIcon, CheckCircleIcon, CircleIcon, HelpCircleIcon, MinusCircleIcon, XCircleIcon,
} from '../icons'
import { Spinner } from './spinner'

/**
 * 진단·검사 결과 하나의 상태를 아이콘으로 보여준다.
 *
 * 상태별 아이콘과 색이 화면마다 달라지면 같은 실패가 다른 심각도로 읽힌다 —
 * 그래서 매핑을 한 곳에 둔다. 글자 라벨은 화면이 정하고, 여기서는 기호만 낸다.
 */
export type StatusKind =
  | 'success'
  | 'warning'
  | 'failed'
  | 'running'
  | 'skipped'
  | 'unknown'
  | 'pending'

const TONE: Record<StatusKind, string> = {
  success: 'var(--ig-color-success)',
  warning: 'var(--ig-color-warning)',
  failed: 'var(--ig-color-danger)',
  running: 'var(--ig-color-accent)',
  skipped: 'var(--ig-color-text-muted)',
  unknown: 'var(--ig-color-text-muted)',
  pending: 'var(--ig-color-text-muted)',
}

export interface StatusIconProps {
  status: StatusKind
  size?: number
  className?: string
  'data-ig-component'?: string
  'data-ig-slot'?: string
}

export function StatusIcon({
  status,
  size = 14,
  className,
  'data-ig-component': componentHint,
  'data-ig-slot': slotHint,
}: StatusIconProps): React.ReactElement {
  const componentName = 'StatusIcon'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  const color = TONE[status]
  const common = {
    className,
    'data-ig-component': componentName,
    'data-ig-layer': 'components',
    'data-ig-slot': slotName,
    'data-ig-kind': `status-${status}`,
  }

  if (status === 'running') return <Spinner size="sm" tone="muted" {...common} />

  const Glyph = {
    success: CheckCircleIcon,
    warning: AlertTriangleIcon,
    failed: XCircleIcon,
    skipped: MinusCircleIcon,
    unknown: HelpCircleIcon,
    pending: CircleIcon,
  }[status]

  return <Glyph size={size} color={color} {...common} />
}
