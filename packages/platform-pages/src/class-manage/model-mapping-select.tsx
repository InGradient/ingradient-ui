import { Stack, Text } from '@ingradient/ui/primitives'
import { SelectField } from '@ingradient/ui/components'

const SELECT_STYLE = {
  maxWidth: 280,
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  fontSize: 13,
  borderRadius: 'var(--ig-radius-2xs)',
}

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
    return <Text size="12px" tone="soft">{disabledHint}</Text>
  }
  return (
    <Stack gap={3}>
      <SelectField
        value={value ?? ''}
        onChange={(e) => onChange?.((e.target as HTMLSelectElement).value)}
        aria-label={ariaLabel}
        title={title}
        style={SELECT_STYLE}
      >
        <option value="">{unmappedLabel}</option>
        {options.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </SelectField>
      <Text size="12px" tone="soft">{enabledHint}</Text>
    </Stack>
  )
}
