// 설정 > 연결 탭 위쪽 — 카메라 설치 6단계 진단.
// 단계 판정은 앱이 하고 여기서는 결과만 그린다.
import { useState } from 'react'
import { Stack } from '@ingradient/ui'
import { SetupStageCardView, SetupSummaryView } from '@ingradient/edge-pages'
import {
  CONNECTED_STAGES, STAGE_CARD_LABELS, SUMMARY_DESCRIPTION, SUMMARY_LABELS, SUMMARY_STEPS,
} from '../../../../fixtures/edge/0.0.5'

const noop = (): undefined => undefined

export function CameraSetupPanel(): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Stack gap="var(--ig-space-5)">
      <SetupSummaryView
        steps={SUMMARY_STEPS}
        overallStatus="success"
        description={SUMMARY_DESCRIPTION}
        guidedAction="continue"
        labels={SUMMARY_LABELS}
        onStart={noop}
        onCancel={noop}
        onViewProblem={noop}
        onRestart={noop}
        restartDisabled
      />
      {CONNECTED_STAGES.map((stage) => (
        <SetupStageCardView
          key={stage.id}
          stage={stage}
          expanded={openId === stage.id}
          labels={STAGE_CARD_LABELS}
          onToggle={() => setOpenId((prev) => (prev === stage.id ? null : stage.id))}
        />
      ))}
    </Stack>
  )
}
