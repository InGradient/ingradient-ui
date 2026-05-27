import type { ReactNode } from 'react'
import { Stack } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { TextField, TextareaField } from '../../components/inputs/text-fields'
import { InfoSection } from '../../components/data-display/info-section'
import { ColorInputRow } from '../forms/color-input-row'

const SIDEBAR_STYLE = {
  width: 300,
  flexShrink: 0,
  background: 'var(--ig-color-surface-panel)',
  borderRadius: 'var(--ig-radius-xl)',
  border: '1px solid var(--ig-color-border-subtle)',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden' as const,
}

const PANEL_STYLE = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto' as const,
  padding: 'var(--ig-space-7)',
}

const NAME_INPUT_STYLE = { maxWidth: 280, borderRadius: 'var(--ig-radius-2xs)' }
const DESCRIPTION_STYLE = { minHeight: 72, maxWidth: '100%', fontSize: 13, resize: 'vertical' as const }
const DELETE_BTN_STYLE = {
  marginTop: 'var(--ig-space-3)',
  padding: 'var(--ig-space-3) var(--ig-space-7)',
  borderRadius: 'var(--ig-radius-xs)',
}

export interface ClassInfoSidebarClass {
  id: string
  name: string
  color: string
  description?: string | null
}

export interface ClassInfoSidebarProps {
  selectedClass: ClassInfoSidebarClass
  onChangeName?: (name: string) => void
  onChangeColor?: (hex: string) => void
  onChangeDescription?: (description: string | undefined) => void
  onRandomizeColor?: () => void
  onDelete?: () => void
  /** 6-2-D — Reference image 섹션 콘텐츠 (Phase 4 의 ReferenceImageSection 등) */
  referenceImageSlot?: ReactNode
  /** 6-2-E — Model mapping 섹션 콘텐츠 (Phase 6 의 ModelMappingSelect 등) */
  mappingSlot?: ReactNode
  /** Danger zone 버튼 라벨 커스텀 */
  deleteLabel?: string
  descriptionPlaceholder?: string
}

export function ClassInfoSidebar({
  selectedClass,
  onChangeName, onChangeColor, onChangeDescription,
  onRandomizeColor, onDelete,
  referenceImageSlot, mappingSlot,
  deleteLabel = 'Delete class',
  descriptionPlaceholder = 'Class description (optional)',
}: ClassInfoSidebarProps) {
  return (
    <Stack as="aside" gap={0} style={SIDEBAR_STYLE}>
      <Stack gap={9} style={PANEL_STYLE}>
        <InfoSection title="Name">
          <TextField
            size="sm"
            value={selectedClass.name}
            onChange={(e) => onChangeName?.(e.target.value)}
            aria-label="Class name"
            style={NAME_INPUT_STYLE}
          />
        </InfoSection>

        <InfoSection title="Color">
          <ColorInputRow
            value={selectedClass.color}
            onChange={onChangeColor}
            onRandomize={onRandomizeColor}
            ariaLabel="Class color"
          />
        </InfoSection>

        <InfoSection title="Description">
          <TextareaField
            value={selectedClass.description ?? ''}
            onChange={(e) => onChangeDescription?.(e.target.value || undefined)}
            placeholder={descriptionPlaceholder}
            rows={3}
            style={DESCRIPTION_STYLE}
          />
        </InfoSection>

        {referenceImageSlot}
        {mappingSlot}

        <InfoSection title="Danger zone">
          <Button type="button" variant="secondary" tone="danger" onClick={onDelete} style={DELETE_BTN_STYLE}>{deleteLabel}</Button>
        </InfoSection>
      </Stack>
    </Stack>
  )
}
