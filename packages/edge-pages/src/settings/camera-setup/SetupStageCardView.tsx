import { Badge, Button, Card, Inline, Stack, StatusIcon, Text } from '@ingradient/ui'
import { ChevronDownIcon, ChevronRightIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { SetupCheck, SetupStageCardViewProps } from '../types'

/** 배지 색은 심각도다 — 실패가 회색으로 보이면 넘어가게 된다. */
const BADGE_TONE = {
  success: 'success', warning: 'warning', failed: 'danger', running: 'accent',
  skipped: 'neutral', unknown: 'neutral', pending: 'neutral',
} as const

function CheckList({ checks }: { checks: SetupCheck[] }): JSX.Element {
  return (
    <Stack gap="var(--ig-space-2)" role="list">
      {checks.map((check) => (
        <Inline key={check.id} gap="var(--ig-space-2)" align="center" role="listitem">
          <StatusIcon status={check.status} size={13} />
          <Text tone="secondary" size="var(--ig-font-size-2xs)">{check.summary}</Text>
        </Inline>
      ))}
    </Stack>
  )
}

/** 원본 오류 문자열은 접어 둔다 — 평소엔 방해가 되고, 막혔을 때만 필요하다. */
function TechnicalDetails({ checks, label }: { checks: SetupCheck[]; label: string }): JSX.Element | null {
  if (checks.length === 0) return null
  const lines = checks.map((c) => `${c.id}: ${c.status}${c.detail ? ` — ${c.detail}` : ''}`)
  return (
    <details>
      <summary>
        <Text tone="muted" size="var(--ig-font-size-2xs)">{label}</Text>
      </summary>
      <Text
        as="pre"
        tone="muted"
        size="var(--ig-font-size-2xs)"
        fontFamily="mono"
        style={{ whiteSpace: 'pre-wrap', margin: 0 }}
      >
        {lines.join('\n')}
      </Text>
    </details>
  )
}

export function SetupStageCardView(props: SetupStageCardViewProps): JSX.Element {
  const { stage, expanded, onToggle, action, remediation, labels } = props
  const bodyId = `camera-setup-stage-${stage.id}`
  // 실패·경고는 테두리로도 드러나야 카드 목록에서 바로 눈에 띈다.
  const border = stage.status === 'failed' || stage.status === 'warning' ? 'strong' : 'default'

  return (
    <Card padding="var(--ig-space-4)" radius="var(--ig-radius-xs)" border={border} flat>
      <Stack gap="var(--ig-space-3)">
        {/* 헤더 전체가 토글이다. Inline 은 레이아웃만 맡고 a11y 속성은 button 이 갖는다. */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            textAlign: 'left', width: '100%',
          }}
        >
          <Inline gap="var(--ig-space-3)" align="center">
            {expanded
              ? <ChevronDownIcon size={iconSizeNumbers.xs} />
              : <ChevronRightIcon size={iconSizeNumbers.xs} />}
            <Text tone="muted" size="var(--ig-font-size-2xs)" tabularNums>{stage.order}</Text>
            <StatusIcon status={stage.status} />
            <Text size="var(--ig-font-size-xs)" weight="medium">{stage.title}</Text>
            <Text tone="muted" size="var(--ig-font-size-2xs)" style={{ flex: 1, minWidth: 0 }}>
              {stage.summary}
            </Text>
            {stage.updatedAtLabel && (
              <Text tone="muted" size="var(--ig-font-size-2xs)" tabularNums>{stage.updatedAtLabel}</Text>
            )}
            <Badge $tone={BADGE_TONE[stage.status]}>{labels.statusLabel(stage.status)}</Badge>
          </Inline>
        </button>

        {expanded && (
          <Stack gap="var(--ig-space-3)" id={bodyId}>
            <CheckList checks={stage.checks} />
            {remediation}
            {action && stage.status !== 'running' && (
              <Inline gap="var(--ig-space-3)">
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  disabled={!action.enabled}
                  onClick={action.onRun}
                >
                  {action.label}
                </Button>
              </Inline>
            )}
            <TechnicalDetails checks={stage.checks} label={labels.technicalDetails} />
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
