import type { Dispatch, SetStateAction } from 'react'
import { SelectField } from '@ingradient/ui/components'
import type { DeflectometryConfig, DeflectometryPatternLabel } from './edge-types'
import {
  CheckItem,
  CheckList,
  FieldRow,
  Hint,
  Label,
  NumberInput,
  Section,
  SectionTitle,
} from './edge.styles'
import { DeflectometryPreview } from './DeflectometryPreview'
import { DeflectometryQualityFields } from './DeflectometryQualityFields'

const PHASE_SHIFT_MIN = 2
const PHASE_SHIFT_MAX = 16
const FRINGE_PERIOD_MIN = 4
const FRINGE_PERIOD_DEFAULT = 20

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export interface DeflectometryOptionsProps {
  defl: DeflectometryConfig
  setDefl: Dispatch<SetStateAction<DeflectometryConfig>>
  /** Caller 가 `computeTotalPatterns(defl)` 으로 계산해서 전달. */
  totalPatterns: number
  /** Pattern label 목록. caller 가 `buildPatternLabels(defl)` 로 계산. */
  patternLabels: DeflectometryPatternLabel[]
  /** Badge 라벨 포맷 함수. */
  formatBadgeLabel?: (label: DeflectometryPatternLabel) => string
  /** Canvas 에 pattern 그리는 callback. */
  renderPattern: (
    canvas: HTMLCanvasElement,
    label: DeflectometryPatternLabel,
    config: DeflectometryConfig,
  ) => void
}

/**
 * Deflectometry 캡쳐 옵션 폼. Platform 의 `DeflectometryOptions` 와 시각·구조 동일.
 * `totalPatterns` / `patternLabels` / `renderPattern` 은 platform util 결과를 props 로 주입.
 */
export function DeflectometryOptions({
  defl,
  setDefl,
  totalPatterns,
  patternLabels,
  formatBadgeLabel,
  renderPattern,
}: DeflectometryOptionsProps) {
  return (
    <Section>
      <SectionTitle>Deflectometry</SectionTitle>
      <FieldRow>
        <Label htmlFor="defl-phase-count">Phase shifts per direction</Label>
        <NumberInput
          id="defl-phase-count"
          min={PHASE_SHIFT_MIN}
          max={PHASE_SHIFT_MAX}
          value={defl.phase_shift_count}
          onChange={(value) =>
            setDefl((c) => ({
              ...c,
              phase_shift_count: clamp(value || PHASE_SHIFT_MIN, PHASE_SHIFT_MIN, PHASE_SHIFT_MAX),
            }))
          }
        />
        <Hint>
          {PHASE_SHIFT_MIN}–{PHASE_SHIFT_MAX} (recommended: 4)
        </Hint>
      </FieldRow>
      <Hint>
        Number of phase-shifted fringe patterns captured per direction. More shifts improve phase decoding accuracy.
      </Hint>
      <FieldRow>
        <Label htmlFor="defl-directions">Capture directions</Label>
        <SelectField
          id="defl-directions"
          aria-label="Capture directions"
          title="Capture directions"
          value={defl.capture_directions}
          onChange={(e) =>
            setDefl((c) => ({
              ...c,
              capture_directions: e.target.value as DeflectometryConfig['capture_directions'],
            }))
          }
        >
          <option value="both">X + Y (both)</option>
          <option value="x_only">X only (horizontal fringe)</option>
          <option value="y_only">Y only (vertical fringe)</option>
        </SelectField>
      </FieldRow>
      <Hint>
        Fringe orientation to project. X + Y enables full 2D surface reconstruction; single-axis is faster but limited.
      </Hint>
      <CheckList>
        <CheckItem>
          <input
            type="checkbox"
            checked={defl.include_solid}
            onChange={(e) => setDefl((c) => ({ ...c, include_solid: e.target.checked }))}
          />
          Include solid (white reference)
        </CheckItem>
        <Hint>Fully-lit reference frame for ambient light and surface albedo correction.</Hint>
        <CheckItem>
          <input
            type="checkbox"
            checked={defl.include_black}
            onChange={(e) => setDefl((c) => ({ ...c, include_black: e.target.checked }))}
          />
          Include black (dark current)
        </CheckItem>
        <Hint>Dark frame to subtract sensor noise and bias from pattern captures.</Hint>
      </CheckList>
      <FieldRow>
        <Label htmlFor="defl-fringe-period">Fringe period (px)</Label>
        <NumberInput
          id="defl-fringe-period"
          min={FRINGE_PERIOD_MIN}
          value={defl.fringe_period_default}
          onChange={(value) =>
            setDefl((c) => ({
              ...c,
              fringe_period_default: Math.max(FRINGE_PERIOD_MIN, value || FRINGE_PERIOD_DEFAULT),
            }))
          }
        />
      </FieldRow>
      <Hint>
        Pixel width of one fringe cycle on the projected pattern. Smaller values yield higher spatial resolution but
        less robust unwrapping.
      </Hint>
      <FieldRow>
        <Label htmlFor="defl-exposure">Exposure per pattern</Label>
        <SelectField
          id="defl-exposure"
          aria-label="Exposure per pattern"
          title="Exposure per pattern"
          value={defl.exposure_per_pattern}
          onChange={(e) =>
            setDefl((c) => ({
              ...c,
              exposure_per_pattern: e.target.value as DeflectometryConfig['exposure_per_pattern'],
            }))
          }
        >
          <option value="same">Same (single exposure)</option>
          <option value="auto_hdr">Auto HDR (adjust per pattern)</option>
        </SelectField>
      </FieldRow>
      <Hint>
        Same uses one fixed exposure for every pattern. Auto HDR adjusts per pattern to handle bright and dark regions
        together.
      </Hint>
      <DeflectometryQualityFields defl={defl} setDefl={setDefl} />
      <Hint>
        Total patterns per sequence: <strong>{totalPatterns}</strong>
      </Hint>
      <DeflectometryPreview
        config={defl}
        patternLabels={patternLabels}
        formatBadgeLabel={formatBadgeLabel}
        renderPattern={renderPattern}
      />
    </Section>
  )
}
