import { useState } from 'react'
import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { RadioCardGroup } from '../../components/inputs/radio-card-group'
import { Checkbox } from '../../components/inputs/toggles'
import { ColorSwatch } from '../../components/data-display/color-swatch'

import { FormField } from '../../components/inputs'

export type DatasetTaskType = 'object_detection' | 'classification' | 'segmentation' | 'point'

const CLASS_LIST_STYLE = {
  maxHeight: 'var(--ig-popup-3xs)',
  overflowY: 'auto' as const,
  paddingRight: 'var(--ig-space-1)',
}

const ClassRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: var(--ig-space-1) var(--ig-space-2);
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

export interface DatasetTaskOption { value: DatasetTaskType; label: string; disabled?: boolean }

// 기본 task 옵션 — 소비자가 taskOptions prop 으로 라벨/구성 override 가능(도메인 하드코딩 회피, 규칙 #3/#5).
const DEFAULT_TASK_OPTIONS: DatasetTaskOption[] = [
  { value: 'classification', label: 'Classification' },
  { value: 'object_detection', label: 'Object Detection' },
  { value: 'segmentation', label: 'Segmentation — Coming soon', disabled: true },
  { value: 'point', label: 'Point' },
]

export interface AddDatasetClassOption {
  id: string
  name: string
  color: string
}

export interface AddDatasetModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; taskType: DatasetTaskType; classIds: string[] }) => void
  classes: AddDatasetClassOption[]
  /** task 타입 옵션 — 미지정 시 기본(classification/object_detection/segmentation/point). */
  taskOptions?: DatasetTaskOption[]
  initialName?: string
  initialTaskType?: DatasetTaskType
  initialClassIds?: string[]
  submitting?: boolean
}

export function AddDatasetModal({
  open, onClose, onSubmit, classes,
  taskOptions = DEFAULT_TASK_OPTIONS,
  initialName = '', initialTaskType = 'object_detection', initialClassIds = [],
  submitting,
}: AddDatasetModalProps) {
  const [name, setName] = useState(initialName)
  const [taskType, setTaskType] = useState<DatasetTaskType>(initialTaskType)
  const [classIds, setClassIds] = useState<Set<string>>(() => new Set(initialClassIds))

  if (!open) return null

  const canSubmit = name.trim().length > 0 && !submitting

  return (
    <DialogShell
      title="Add dataset"
      onClose={onClose}
      width="min(var(--ig-popup-2xl), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="accent"
            disabled={!canSubmit}
            onClick={() => onSubmit({ name: name.trim(), taskType, classIds: Array.from(classIds) })}
          >
            {submitting ? 'Creating…' : 'Create dataset'}
          </Button>
        </>
      }
    >
      <FormField label="Name" htmlFor="add-dataset-name">
        <TextField
          id="add-dataset-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wafer line A — 2026 Q1"
        />
      </FormField>
      <FormField label="Task type">
        <RadioCardGroup
          options={taskOptions}
          value={taskType}
          onChange={(value) => setTaskType(value as DatasetTaskType)}
        />
      </FormField>
      {classes.length > 0 ? (
        <FormField label="Connect classes (optional)">
          <Stack gap="var(--ig-space-2)" style={CLASS_LIST_STYLE}>
            {classes.map((c) => (
              <ClassRow key={c.id}>
                <Checkbox
                  aria-label={`Connect class ${c.name}`}
                  checked={classIds.has(c.id)}
                  onChange={(e) => {
                    const next = new Set(classIds)
                    if (e.target.checked) next.add(c.id); else next.delete(c.id)
                    setClassIds(next)
                  }}
                />
                <ColorSwatch $color={c.color} $size="xs" />
                <Text as="span" size="var(--ig-font-size-sm)">{c.name}</Text>
              </ClassRow>
            ))}
          </Stack>
        </FormField>
      ) : null}
    </DialogShell>
  )
}
