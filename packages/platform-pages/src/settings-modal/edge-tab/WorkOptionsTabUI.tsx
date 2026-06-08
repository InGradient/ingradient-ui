import { Button, Checkbox } from '@ingradient/ui/components'
import type {
  DeflectometryConfig,
  DeflectometryPatternLabel,
  EdgePackageOptions,
} from './edge-types'
import {
  CheckItem,
  CheckList,
  ErrorHint,
  FieldRow,
  Label,
  NumberInput,
  Section,
  SectionTitle,
} from './edge.styles'
import { DeflectometryOptions } from './DeflectometryOptions'

export interface WorkOptionsTabUIProps {
  options: EdgePackageOptions
  onOptionsChange: (next: EdgePackageOptions) => void
  /** true 일 때 Deflectometry 섹션 렌더. `defl` / `onDeflChange` / 관련 prop 필요. */
  deflectometryEnabled: boolean
  defl: DeflectometryConfig
  onDeflChange: React.Dispatch<React.SetStateAction<DeflectometryConfig>>
  /** Caller 가 `computeTotalPatterns(defl)` 로 계산. */
  totalPatterns: number
  patternLabels: DeflectometryPatternLabel[]
  formatBadgeLabel?: (label: DeflectometryPatternLabel) => string
  renderPattern: (
    canvas: HTMLCanvasElement,
    label: DeflectometryPatternLabel,
    config: DeflectometryConfig,
  ) => void
  savePending: boolean
  saveError?: string | null
  onSave: () => void
}

/**
 * Work options tab UI. Platform 의 `WorkOptionsTab` 의 pure UI 추출.
 * `useWorkOptionsSave()` mutation 의 상태 + deflectometry config state 를 props 로 받음.
 */
export function WorkOptionsTabUI({
  options,
  onOptionsChange,
  deflectometryEnabled,
  defl,
  onDeflChange,
  totalPatterns,
  patternLabels,
  formatBadgeLabel,
  renderPattern,
  savePending,
  saveError,
  onSave,
}: WorkOptionsTabUIProps) {
  return (
    <>
      <Section>
        <SectionTitle>Locked on Edge</SectionTitle>
        <CheckList>
          <CheckItem>
            <Checkbox
              aria-label="Require labeling before proceeding"
              label="Require labeling before proceeding"
              checked={options.require_labeling}
              onChange={(event) =>
                onOptionsChange({ ...options, require_labeling: event.target.checked })
              }
            />
          </CheckItem>
          <CheckItem>
            <Checkbox
              aria-label="Block Save if no label"
              label={'Block "Save" if no label (hides Skip button)'}
              checked={options.block_next_without_labeling}
              onChange={(event) =>
                onOptionsChange({ ...options, block_next_without_labeling: event.target.checked })
              }
            />
          </CheckItem>
        </CheckList>
        <FieldRow>
          <Label htmlFor="min-bbox">Min BBox count</Label>
          <NumberInput
            id="min-bbox"
            min={0}
            value={options.require_min_bbox_count}
            onChange={(value) =>
              onOptionsChange({ ...options, require_min_bbox_count: value || 0 })
            }
          />
        </FieldRow>
      </Section>

      {deflectometryEnabled && (
        <DeflectometryOptions
          defl={defl}
          setDefl={onDeflChange}
          totalPatterns={totalPatterns}
          patternLabels={patternLabels}
          formatBadgeLabel={formatBadgeLabel}
          renderPattern={renderPattern}
        />
      )}

      <div style={{ marginTop: 'var(--ig-space-7)' }}>
        <Button variant="accent" type="button" onClick={onSave} disabled={savePending}>
          {savePending ? 'Saving…' : 'Save Work Options'}
        </Button>
        {saveError && <ErrorHint style={{ marginTop: 'var(--ig-space-3)' }}>{saveError}</ErrorHint>}
      </div>
    </>
  )
}
