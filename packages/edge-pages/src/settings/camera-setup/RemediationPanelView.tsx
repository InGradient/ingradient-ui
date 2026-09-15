import { useState } from 'react'
import { Badge, Button, Inline, Stack, Text } from '@ingradient/ui'

import type { RemediationActionItem, RemediationPanelViewProps } from '../types'

/**
 * 실패·경고 카드 안의 문제 해결 패널.
 *
 * 되돌리기 어려운 동작은 한 번 더 눌러야 실행된다(확인 상태는 이 화면에서만 산다).
 * 첫 번째 action 은 실패 원인에 맞는 권장 해결책이라 기본 버튼으로 강조한다.
 */
export function RemediationPanelView(props: RemediationPanelViewProps): JSX.Element | null {
  const { actions, activeActionId, outcomes, canRun, labels, onRun } = props
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  if (actions.length === 0) return null

  const handleClick = (action: RemediationActionItem): void => {
    if (action.requiresConfirmation && confirmingId !== action.id) {
      setConfirmingId(action.id)
      return
    }
    setConfirmingId(null)
    onRun(action.id)
  }

  return (
    <Stack gap="var(--ig-space-3)">
      {actions.map((action, index) => {
        const outcome = outcomes[action.id]
        const isActive = activeActionId === action.id
        const isConfirming = confirmingId === action.id
        const variant = isConfirming ? 'accent' : index === 0 ? 'solid' : 'secondary'

        return (
          <Stack key={action.id} gap="var(--ig-space-2)">
            <Inline gap="var(--ig-space-2)" align="center">
              {action.isGuidance ? (
                <Badge $tone="neutral">{action.label}</Badge>
              ) : (
                <Button
                  size="sm"
                  variant={variant}
                  type="button"
                  disabled={!canRun && !isActive}
                  onClick={() => handleClick(action)}
                >
                  {isActive ? labels.running : isConfirming ? labels.confirm : action.label}
                </Button>
              )}
              {isConfirming && (
                <Button size="sm" variant="ghost" type="button" onClick={() => setConfirmingId(null)}>
                  {labels.cancel}
                </Button>
              )}
            </Inline>

            {action.isGuidance && action.hint && (
              <Text tone="muted" size="var(--ig-font-size-2xs)">{action.hint}</Text>
            )}

            {outcome && (
              <Text
                tone={outcome.ok ? 'success' : 'danger'}
                size="var(--ig-font-size-2xs)"
              >
                {outcome.ok ? labels.resultOk : labels.resultFail}
                {outcome.detail ? ` — ${outcome.detail}` : ''}
                {outcome.changedLabel ? ` (${outcome.changedLabel})` : ''}
              </Text>
            )}
          </Stack>
        )
      })}
      <Text tone="muted" size="var(--ig-font-size-2xs)">{labels.autoVerifyHint}</Text>
    </Stack>
  )
}
