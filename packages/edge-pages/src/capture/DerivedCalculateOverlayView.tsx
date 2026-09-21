import { Button, Scrim, Spinner, Stack, Text } from '@ingradient/ui'

/**
 * 아직 계산되지 않은 파생 뷰를 골랐을 때 이미지 영역 가운데 띄우는 오버레이.
 * 촬영 직후 화면과 Images 모달이 같은 것을 쓴다.
 *
 * 버튼 문구는 'Calculate' 하나다 — 어떤 뷰인지는 좌측 목록의 선택 항목이 이미 보여준다.
 */
export type DerivedCalcState = 'idle' | 'running' | 'error' | 'unavailable'

export interface DerivedCalculateOverlayViewProps {
  state: DerivedCalcState
  /** 눌리지 않거나 실패한 이유. 없으면 아무 줄도 붙지 않는다. */
  reason?: string | null
  labels: { calculate: string; calculating: string }
  onCalculate: () => void
}

export function DerivedCalculateOverlayView(props: DerivedCalculateOverlayViewProps): JSX.Element {
  const { state, reason, labels, onCalculate } = props
  const running = state === 'running'

  return (
    <Scrim>
      <Stack gap="var(--ig-space-3)" align="center" style={{ maxWidth: '21rem', textAlign: 'center' }}>
        <Button
          size="md"
          variant="accent"
          disabled={running || state === 'unavailable'}
          onClick={onCalculate}
        >
          {running ? <><span aria-hidden="true"><Spinner size="sm" /></span>{labels.calculating}</> : labels.calculate}
        </Button>

        {/* 버튼이 눌리지 않는 이유는 남긴다 — 없으면 왜 안 되는지 알 수 없다. */}
        {(state === 'unavailable' || state === 'error') && reason && (
          <Text tone="muted" size="var(--ig-font-size-xs)">{reason}</Text>
        )}
      </Stack>
    </Scrim>
  )
}
