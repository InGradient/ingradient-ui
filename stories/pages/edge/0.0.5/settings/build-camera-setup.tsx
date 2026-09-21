// 설정 > 연결 탭 위쪽 — 카메라 설치 6단계 진단.
// 단계 판정은 앱이 하고 여기서는 결과만 그린다.
import { useState } from 'react'
import { Stack } from '@ingradient/ui'
import { SetupStageCardView, SetupSummaryView } from '@ingradient/edge-pages'
import {
  CONNECTED_STAGES, STAGE_CARD_LABELS, SUMMARY_DESCRIPTION, SUMMARY_LABELS, SUMMARY_STEPS,
} from '../../../../fixtures/edge/0.0.5'

import type { MockAction } from './tabs-moved'

export function CameraSetupPanel({ onMockAction }: { onMockAction: MockAction }): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const action = (name: string) => { setResult(`Mock setup ${name}; no device was contacted.`); onMockAction(`camera-setup-${name}`) }

  return (
    <Stack gap="var(--ig-space-5)">
      <SetupSummaryView
        steps={SUMMARY_STEPS}
        overallStatus="success"
        description={SUMMARY_DESCRIPTION}
        guidedAction="continue"
        labels={SUMMARY_LABELS}
        onStart={() => action('continue')}
        onCancel={() => action('cancelled')}
        onViewProblem={() => { setOpenId(CONNECTED_STAGES[0]?.id ?? null); action('details') }}
        onRestart={() => action('restarted')}
      />
      {result && <p role="status">{result}</p>}
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
