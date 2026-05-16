import type { StatusTone } from '@ingradient/ui/components'

/**
 * Edge package / import job status string → `StatusTone` 매핑.
 * Platform 의 `getStatusTone()` 와 동일 로직.
 */
export function getEdgeStatusTone(status: string): StatusTone {
  if (status === 'completed') return 'completed'
  if (status === 'failed') return 'failed'
  if (status === 'cancelled') return 'idle'
  if (status === 'running') return 'running'
  if (status === 'pending') return 'queued'
  return 'idle'
}
