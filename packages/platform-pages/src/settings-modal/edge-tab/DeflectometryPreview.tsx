import { useEffect, useRef, useState } from 'react'
import type { DeflectometryConfig, DeflectometryPatternLabel } from './edge-types'
import { Badge, BadgeRow, CanvasFrame, PreviewHint, PreviewWrap } from './DeflectometryPreview.styles'

const PREVIEW_WIDTH = 360
const PREVIEW_HEIGHT = 220

export interface DeflectometryPreviewProps {
  config: DeflectometryConfig
  /** 현재 config 에서 표시 가능한 pattern 라벨 목록. caller 가 `buildPatternLabels(config)` 로 계산. */
  patternLabels: DeflectometryPatternLabel[]
  /** Badge 라벨 포맷. 기본은 raw label 표시. */
  formatBadgeLabel?: (label: DeflectometryPatternLabel) => string
  /**
   * Canvas 에 pattern 을 그리는 callback. caller 가 platform util (`drawPattern`) 을 그대로 전달.
   * label / config 변경 시 자동 호출됨.
   */
  renderPattern: (
    canvas: HTMLCanvasElement,
    label: DeflectometryPatternLabel,
    config: DeflectometryConfig,
  ) => void
}

/**
 * Deflectometry pattern 미리보기 canvas + label badge tab.
 * Platform 의 `DeflectometryPreview` 와 시각·구조 동일. 단 platform-specific util 은 props 로 주입.
 */
export function DeflectometryPreview({
  config,
  patternLabels,
  formatBadgeLabel,
  renderPattern,
}: DeflectometryPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selected, setSelected] = useState<DeflectometryPatternLabel>(patternLabels[0] ?? '')

  useEffect(() => {
    if (!patternLabels.includes(selected)) setSelected(patternLabels[0] ?? '')
  }, [patternLabels, selected])

  useEffect(() => {
    if (canvasRef.current && selected) renderPattern(canvasRef.current, selected, config)
  }, [selected, config, renderPattern])

  if (patternLabels.length === 0) return null

  return (
    <PreviewWrap>
      <BadgeRow role="tablist" aria-label="Pattern preview selector">
        {patternLabels.map((label) => (
          <Badge
            key={label}
            type="button"
            role="tab"
            aria-selected={label === selected}
            $active={label === selected}
            onClick={() => setSelected(label)}
          >
            {formatBadgeLabel ? formatBadgeLabel(label) : label}
          </Badge>
        ))}
      </BadgeRow>
      <CanvasFrame>
        <canvas
          ref={canvasRef}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          role="img"
          aria-label={`Deflectometry pattern preview: ${formatBadgeLabel ? formatBadgeLabel(selected) : selected}`}
        />
      </CanvasFrame>
      <PreviewHint>
        Pattern: <strong>{selected}</strong> · period {config.fringe_period_default}px
      </PreviewHint>
    </PreviewWrap>
  )
}
