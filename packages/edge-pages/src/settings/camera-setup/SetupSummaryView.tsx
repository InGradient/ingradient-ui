import { Badge, Button, Card, Inline, Spinner, Stack, StepIndicator, Text } from '@ingradient/ui'
import { AlertTriangleIcon, CheckCircleIcon, PlayIcon, RefreshIcon, XCircleIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { SetupSummaryViewProps } from '../types'

const BADGE_TONE = {
  success: 'success', warning: 'warning', failed: 'danger', running: 'accent',
  skipped: 'neutral', unknown: 'neutral', pending: 'neutral',
} as const

/** 지금 무엇을 누를 수 있는지가 이 카드의 요점이다 — 상태마다 버튼 구성이 달라진다. */
function GuidedActions(props: SetupSummaryViewProps): JSX.Element {
  const { guidedAction, labels, onStart, onCancel, onViewProblem, onRestart, restartDisabled } = props
  return (
    <Inline gap="var(--ig-space-2)" align="center">
      {guidedAction === 'running' && (
        <>
          <Button size="sm" variant="secondary" type="button" disabled>
            <Spinner size="sm" tone="muted" />
            {labels.guided.running}
          </Button>
          <Button size="sm" variant="ghost" type="button" onClick={onCancel}>
            <XCircleIcon size={iconSizeNumbers.xs} />
            {labels.cancel}
          </Button>
        </>
      )}

      {(guidedAction === 'start' || guidedAction === 'continue' || guidedAction === 'resume') && (
        <Button size="sm" type="button" onClick={onStart}>
          <PlayIcon size={iconSizeNumbers.xs} />
          {labels.guided[guidedAction]}
        </Button>
      )}

      {guidedAction === 'view_problem' && (
        <>
          <Button size="sm" type="button" onClick={onViewProblem}>
            <AlertTriangleIcon size={iconSizeNumbers.xs} />
            {labels.guided.view_problem}
          </Button>
          <Button size="sm" variant="secondary" type="button" onClick={onStart}>
            {labels.guided.continue}
          </Button>
        </>
      )}

      {guidedAction === 'completed' && (
        <Badge $tone="success">
          <CheckCircleIcon size={iconSizeNumbers['2xs'] ?? 12} /> {labels.guided.completed}
        </Badge>
      )}

      {onRestart && guidedAction !== 'running' && (
        <Button size="sm" variant="secondary" type="button" onClick={onRestart} disabled={restartDisabled}>
          <RefreshIcon size={iconSizeNumbers.xs} />
          {labels.restart}
        </Button>
      )}
    </Inline>
  )
}

export function SetupSummaryView(props: SetupSummaryViewProps): JSX.Element {
  const { steps, overallStatus, description, labels } = props

  return (
    <Card padding="var(--ig-space-4)" radius="var(--ig-radius-xs)" flat>
      <Stack gap="var(--ig-space-3)">
        <Inline gap="var(--ig-space-3)" align="center" wrap="wrap">
          <Text size="var(--ig-font-size-lg)" weight="bold" style={{ flex: 1, minWidth: 0 }}>
            {labels.title}
          </Text>
          <Badge $tone={BADGE_TONE[overallStatus]}>{labels.overall}</Badge>
          <Text tone="secondary" size="var(--ig-font-size-xs)" weight="semibold">{labels.progress}</Text>
        </Inline>

        <StepIndicator items={steps} />

        <Text tone="secondary" size="var(--ig-font-size-xs)">{description}</Text>

        <Inline gap="var(--ig-space-3)" align="center" justify="space-between" wrap="wrap">
          <Text tone="muted" size="var(--ig-font-size-2xs)">
            {labels.nextStage ?? labels.allDone}
          </Text>
          <GuidedActions {...props} />
        </Inline>
      </Stack>
    </Card>
  )
}
