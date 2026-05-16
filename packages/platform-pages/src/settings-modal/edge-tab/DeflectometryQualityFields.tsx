import type { Dispatch, SetStateAction } from 'react'
import type { DeflectometryConfig } from './edge-types'
import { FieldRow, Hint, Label, NumberInput } from './edge.styles'

const RETRY_MIN = 0
const RETRY_MAX = 3

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export interface DeflectometryQualityFieldsProps {
  defl: DeflectometryConfig
  setDefl: Dispatch<SetStateAction<DeflectometryConfig>>
}

/**
 * Deflectometry sequence 의 retry / fringe contrast / saturation 품질 임계값 필드.
 * `DeflectometryOptions` 의 하단 절반. 파일 200줄 제한 위해 분리.
 */
export function DeflectometryQualityFields({ defl, setDefl }: DeflectometryQualityFieldsProps) {
  return (
    <>
      <FieldRow>
        <Label htmlFor="defl-retry">Retry on failure</Label>
        <NumberInput
          id="defl-retry"
          min={RETRY_MIN}
          max={RETRY_MAX}
          value={defl.sequence_retry_policy}
          onChange={(value) =>
            setDefl((c) => ({ ...c, sequence_retry_policy: clamp(value || 0, RETRY_MIN, RETRY_MAX) }))
          }
        />
        <Hint>
          {RETRY_MIN}–{RETRY_MAX} retries per step
        </Hint>
      </FieldRow>
      <Hint>Retries a sequence step when quality checks fail (e.g. low contrast, saturation).</Hint>
      <FieldRow>
        <Label htmlFor="defl-contrast">Min fringe contrast</Label>
        <NumberInput
          id="defl-contrast"
          min={0}
          max={1}
          step={0.05}
          value={defl.min_fringe_contrast}
          onChange={(value) => setDefl((c) => ({ ...c, min_fringe_contrast: clamp(value || 0, 0, 1) }))}
        />
        <Hint>0.0 = disabled, 0.3+ = strict</Hint>
      </FieldRow>
      <Hint>Rejects frames where fringe modulation is too weak to reconstruct reliably.</Hint>
      <FieldRow>
        <Label htmlFor="defl-sat">Max saturation %</Label>
        <NumberInput
          id="defl-sat"
          min={0}
          max={100}
          value={defl.max_saturation_pct}
          onChange={(value) => setDefl((c) => ({ ...c, max_saturation_pct: clamp(value || 100, 0, 100) }))}
        />
        <Hint>100 = disabled</Hint>
      </FieldRow>
      <Hint>Rejects frames whose share of fully-saturated pixels exceeds this threshold.</Hint>
    </>
  )
}
