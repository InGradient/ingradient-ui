import type { ReactNode } from 'react'
import styled from 'styled-components'
import { SidePanelLayout, TextField, TextareaField, type SidePanelLayoutSection } from '@ingradient/ui/components'
import { ColorInputRow } from '@ingradient/ui/patterns'

const Sidebar = styled(SidePanelLayout)<{ $flush: boolean }>`
  width: ${(p) => (p.$flush ? '100%' : 'var(--ig-popup-md-narrow)')};
  flex-shrink: 0;
  background: ${(p) => (p.$flush ? 'transparent' : 'var(--ig-color-surface-panel)')};
  border-radius: ${(p) => (p.$flush ? 0 : 'var(--ig-radius-xl)')};
  border: ${(p) => (p.$flush ? 'none' : 'var(--ig-border-1px) solid var(--ig-color-border-subtle)')};
  min-height: 0;
`

const PropertyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const NAME_INPUT_STYLE = { maxWidth: 'var(--ig-popup-sm)', borderRadius: 'var(--ig-radius-2xs)' }
const DESCRIPTION_STYLE = { minHeight: 'calc(var(--ig-space-13) * 2 + var(--ig-space-3))', maxWidth: '100%', fontSize: 'var(--ig-font-size-sm)', resize: 'vertical' as const }

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
  /** Reference image 섹션 콘텐츠 (ReferenceImageSection 등) */
  referenceImageSlot?: ReactNode
  /** Model mapping 섹션 콘텐츠 (ModelMappingSelect 등) */
  mappingSlot?: ReactNode
  /** flush 시 패널 표면(배경/테두리/라운드) 제거 — shell 컬럼 내부용. */
  flush?: boolean
  descriptionPlaceholder?: string
}

export function ClassInfoSidebar({
  selectedClass,
  onChangeName, onChangeColor, onChangeDescription,
  onRandomizeColor,
  referenceImageSlot, mappingSlot,
  flush = false,
  descriptionPlaceholder = 'Class description (optional)',
}: ClassInfoSidebarProps) {
  const sections: SidePanelLayoutSection[] = [
    {
      title: 'Name',
      body: (
        <PropertyStack>
          <TextField
            size="sm"
            value={selectedClass.name}
            onChange={(e) => onChangeName?.(e.target.value)}
            aria-label="Class name"
            style={NAME_INPUT_STYLE}
          />
          <ColorInputRow
            value={selectedClass.color}
            onChange={onChangeColor}
            onRandomize={onRandomizeColor}
            ariaLabel="Class color"
          />
        </PropertyStack>
      ),
    },
    {
      title: 'Description',
      body: (
        <TextareaField
          value={selectedClass.description ?? ''}
          onChange={(e) => onChangeDescription?.(e.target.value || undefined)}
          placeholder={descriptionPlaceholder}
          rows={3}
          style={DESCRIPTION_STYLE}
        />
      ),
    },
    ...(referenceImageSlot ? [{ title: 'Reference Image', body: referenceImageSlot }] : []),
    ...(mappingSlot ? [{ title: 'Model Mapping', body: mappingSlot }] : []),
  ]
  return <Sidebar $flush={flush} sections={sections} />
}
