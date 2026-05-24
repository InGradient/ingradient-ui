import styled from 'styled-components'
import { SelectField } from '../../components/inputs/select-field'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const StyledSelect = styled(SelectField)`
  max-width: 280px;
  padding: var(--ig-space-3) var(--ig-space-5);
  font-size: 13px;
  border-radius: var(--ig-radius-2xs);
`

const Hint = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-soft);
`

export interface ModelMappingSelectProps {
  /** 모델이 할당돼 있으면 true → select 렌더, false → enabled hint 만 */
  enabled: boolean
  value?: string
  options: string[]
  onChange?: (value: string) => void
  unmappedLabel?: string
  enabledHint?: string
  disabledHint?: string
  ariaLabel?: string
  title?: string
}

export function ModelMappingSelect({
  enabled, value, options, onChange,
  unmappedLabel = '— Not mapped —',
  enabledHint = "Map this class to the detection model's class (COCO) for auto-labeling.",
  disabledHint = 'Assign an object detection model (e.g. YOLO) in AI Models → Assignments to map this class to a model class.',
  ariaLabel = 'Map to COCO class',
  title = 'Map this class to a COCO class',
}: ModelMappingSelectProps) {
  if (!enabled) {
    return <Hint>{disabledHint}</Hint>
  }
  return (
    <Wrap>
      <StyledSelect
        value={value ?? ''}
        onChange={(e) => onChange?.((e.target as HTMLSelectElement).value)}
        aria-label={ariaLabel}
        title={title}
      >
        <option value="">{unmappedLabel}</option>
        {options.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </StyledSelect>
      <Hint>{enabledHint}</Hint>
    </Wrap>
  )
}
