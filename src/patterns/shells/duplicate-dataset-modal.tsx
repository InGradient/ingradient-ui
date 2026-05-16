import React, { useState } from 'react'
import styled from 'styled-components'
import { DialogShell } from '../../components/overlays/dialog-shell'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { Checkbox } from '../../components/inputs/toggles'

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

export interface DuplicateDatasetModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; copyLabels: boolean }) => void
  defaultName: string
  submitting?: boolean
}

export function DuplicateDatasetModal({
  open, onClose, onSubmit, defaultName, submitting,
}: DuplicateDatasetModalProps) {
  const [name, setName] = useState(defaultName)
  const [copyLabels, setCopyLabels] = useState(true)

  if (!open) return null
  const canSubmit = name.trim().length > 0 && !submitting

  return (
    <DialogShell
      title="Duplicate dataset"
      onClose={onClose}
      width="min(480px, 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="accent"
            disabled={!canSubmit}
            onClick={() => onSubmit({ name: name.trim(), copyLabels })}
          >
            {submitting ? 'Duplicating…' : 'Duplicate'}
          </Button>
        </>
      }
    >
      <Field>
        <FieldLabel htmlFor="duplicate-name">New name</FieldLabel>
        <TextField
          id="duplicate-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field>
        <Checkbox
          checked={copyLabels}
          onChange={(e) => setCopyLabels(e.target.checked)}
          label="Copy labels and annotations"
        />
      </Field>
    </DialogShell>
  )
}
