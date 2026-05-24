import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField, TextareaField } from '../../components/inputs/text-fields'
import { ClassInfoSection } from './class-info-section'
import { ColorInputRow } from './color-input-row'

const Sidebar = styled.aside`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-radius: var(--ig-radius-xl);
  border: 1px solid var(--ig-color-border-subtle);
  height: 100%;
  min-height: 0;
  overflow: hidden;
`

const Panel = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-9);
`

const NameInput = styled(TextField).attrs({ size: 'sm' as const })`
  max-width: 280px;
  border-radius: var(--ig-radius-xs);
`

const Description = styled(TextareaField)`
  min-height: 72px;
  max-width: 100%;
  font-size: 13px;
  resize: vertical;
`

const DeleteBtn = styled(Button).attrs({ variant: 'secondary', tone: 'danger' as const })`
  margin-top: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-7);
  border-radius: var(--ig-radius-xs);
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
    <Sidebar>
      <Panel>
        <ClassInfoSection title="Name">
          <NameInput
            value={selectedClass.name}
            onChange={(e) => onChangeName?.(e.target.value)}
            aria-label="Class name"
          />
        </ClassInfoSection>

        <ClassInfoSection title="Color">
          <ColorInputRow
            value={selectedClass.color}
            onChange={onChangeColor}
            onRandomize={onRandomizeColor}
            ariaLabel="Class color"
          />
        </ClassInfoSection>

        <ClassInfoSection title="Description">
          <Description
            value={selectedClass.description ?? ''}
            onChange={(e) => onChangeDescription?.(e.target.value || undefined)}
            placeholder={descriptionPlaceholder}
            rows={3}
          />
        </ClassInfoSection>

        {referenceImageSlot}
        {mappingSlot}

        <ClassInfoSection title="Danger zone">
          <DeleteBtn type="button" onClick={onDelete}>{deleteLabel}</DeleteBtn>
        </ClassInfoSection>
      </Panel>
    </Sidebar>
  )
}
