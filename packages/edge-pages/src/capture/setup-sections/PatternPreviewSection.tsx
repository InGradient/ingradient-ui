import { FieldGroup, SectionTitle } from '@ingradient/ui/patterns'
import { Text } from '@ingradient/ui/primitives'

import { PatternGrid, PatternButton } from '../SetupPanelView.styles'
import type { PreviewPatternLabel, SetupPanelLabels } from '../types'

export interface PatternPreviewSectionProps {
  /** 세울 버튼 목록. 무엇을 찍을지는 프로젝트 설정·실험이 정하므로 앱이 계산해 넘긴다. */
  patterns: string[]
  previewPatternLabel: PreviewPatternLabel | null
  isSetupBusy: boolean
  /** 진행 문구와 상태 문구. 둘 다 없으면 줄이 붙지 않는다. */
  statusText: string | null
  labels: SetupPanelLabels
  /** 버튼 문구는 내부 라벨과 다를 수 있어 앱이 변환해 준다. */
  formatPatternLabel: (pattern: string) => string
  onPreviewPattern: (pattern: PreviewPatternLabel | null) => void
}

/** 지금 화면에 띄워 볼 패턴을 고르는 자리. 같은 버튼을 다시 누르면 끈다. */
export function PatternPreviewSection(props: PatternPreviewSectionProps): JSX.Element {
  const {
    patterns, previewPatternLabel, isSetupBusy, statusText, labels,
    formatPatternLabel, onPreviewPattern,
  } = props

  return (
    <FieldGroup style={{ gap: 'var(--ig-space-4)' }}>
      <SectionTitle>{labels.patternPreview}</SectionTitle>
      <PatternGrid>
        {patterns.map((pattern) => (
          <PatternButton
            key={pattern}
            type="button"
            $active={previewPatternLabel === pattern}
            disabled={isSetupBusy}
            onClick={() => onPreviewPattern(
              previewPatternLabel === pattern ? null : (pattern as PreviewPatternLabel),
            )}
          >
            {formatPatternLabel(pattern)}
          </PatternButton>
        ))}
      </PatternGrid>
      {statusText && <Text tone="muted" size="var(--ig-font-size-xs)">{statusText}</Text>}
    </FieldGroup>
  )
}
