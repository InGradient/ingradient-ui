import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField, TextareaField } from '../../components/inputs/text-fields'
import { ClassInfoSection } from './class-info-section'
import { ColorInputRow } from './color-input-row'

const Sidebar = styled.aside<{ $flush: boolean }>`
  width: ${(p) => (p.$flush ? '100%' : '300px')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) => (p.$flush ? 'transparent' : 'var(--ig-color-surface-panel)')};
  border-radius: ${(p) => (p.$flush ? 0 : 'var(--ig-radius-xl)')};
  border: ${(p) => (p.$flush ? 'none' : '1px solid var(--ig-color-border-subtle)')};
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
  gap: var(--ig-space-7);
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

const DeleteBtn = styled(Button).attrs({ variant: 'secondary', tone: 'danger' as const })`
  margin-top: 8px;
  padding: 8px 16px;
  border-radius: 6px;
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
  flush?: boolean
  deleteLabel?: string
  descriptionPlaceholder?: string
}

export function ClassInfoSidebar({
  selectedClass,
  onChangeName, onChangeColor, onChangeDescription,
  onRandomizeColor, onDelete,
  referenceImageSlot, mappingSlot,
  flush = false,
  deleteLabel = 'Delete class',
  descriptionPlaceholder = 'Class description (optional)',
}: ClassInfoSidebarProps) {
  return (
    <Sidebar $flush={flush}>
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
