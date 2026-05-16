import React, { useState } from 'react'
import styled from 'styled-components'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { RadioCardGroup } from '../../components/inputs/radio-card-group'
import { Checkbox } from '../../components/inputs/toggles'
import { type DatasetTaskType } from '../../components/data-display/dataset-task-tag'

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const FieldLabel = styled.label`
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const ClassList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  max-height: 200px;
  overflow-y: auto;
  padding-right: var(--ig-space-1);
`

const ClassRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
  }
`

const ColorDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`

const TASK_OPTIONS: { value: DatasetTaskType; label: string; disabled?: boolean }[] = [
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
  initialName?: string
  initialTaskType?: DatasetTaskType
  initialClassIds?: string[]
  submitting?: boolean
}

export function AddDatasetModal({
  open, onClose, onSubmit, classes,
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
      width="min(560px, 100%)"
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
      <Field>
        <FieldLabel htmlFor="add-dataset-name">Name</FieldLabel>
        <TextField
          id="add-dataset-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wafer line A — 2026 Q1"
        />
      </Field>
      <Field>
        <FieldLabel>Task type</FieldLabel>
        <RadioCardGroup
          options={TASK_OPTIONS}
          value={taskType}
          onChange={(value) => setTaskType(value as DatasetTaskType)}
        />
      </Field>
      {classes.length > 0 ? (
        <Field>
          <FieldLabel>Connect classes (optional)</FieldLabel>
          <ClassList>
            {classes.map((c) => (
              <ClassRow key={c.id}>
                <Checkbox
                  checked={classIds.has(c.id)}
                  onChange={(e) => {
                    const next = new Set(classIds)
                    if (e.target.checked) next.add(c.id); else next.delete(c.id)
                    setClassIds(next)
                  }}
                />
                <ColorDot $color={c.color} />
                <span style={{ fontSize: 'var(--ig-font-size-sm)' }}>{c.name}</span>
              </ClassRow>
            ))}
          </ClassList>
        </Field>
      ) : null}
    </DialogShell>
  )
}
