import type { ReactNode } from 'react'
import styled from 'styled-components'
import { TextField, TextareaField } from '../../components/inputs/text-fields'
import { CatalogRightPanel } from './catalog-right-panel'
import { ColorInputRow } from './color-input-row'

const Sidebar = styled(CatalogRightPanel)<{ $flush: boolean }>`
  width: ${(p) => (p.$flush ? '100%' : '300px')};
  flex-shrink: 0;
  background: ${(p) => (p.$flush ? 'transparent' : 'var(--ig-color-surface-panel)')};
  border-radius: ${(p) => (p.$flush ? 0 : 'var(--ig-radius-xl)')};
  border: ${(p) => (p.$flush ? 'none' : '1px solid var(--ig-color-border-subtle)')};
`

const NameInput = styled(TextField).attrs({ size: 'sm' as const })`
  max-width: 280px;
  border-radius: 6px;
`

const Description = styled(TextareaField)`
  min-height: 72px;
  max-width: 100%;
  font-size: 13px;
  resize: vertical;
`

const PropertyStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

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
  /** 6-2-D — Reference image 섹션 콘텐츠 (Phase 4 의 ReferenceImageSection 등) */
  referenceImageSlot?: ReactNode
  /** 6-2-E — Model mapping 섹션 콘텐츠 (Phase 6 의 ModelMappingSelect 등) */
  mappingSlot?: ReactNode
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
  return (
    <Sidebar
      $flush={flush}
      sections={[
        {
          title: 'Name',
          body: (
            <PropertyStack>
              <NameInput
                value={selectedClass.name}
                onChange={(e) => onChangeName?.(e.target.value)}
                aria-label="Class name"
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
            <Description
              value={selectedClass.description ?? ''}
              onChange={(e) => onChangeDescription?.(e.target.value || undefined)}
              placeholder={descriptionPlaceholder}
              rows={3}
            />
          ),
        },
        ...(referenceImageSlot ? [{ title: 'Reference Image', body: referenceImageSlot }] : []),
        ...(mappingSlot ? [{ title: 'Model Mapping', body: mappingSlot }] : []),
      ]}
    />
  )
}
