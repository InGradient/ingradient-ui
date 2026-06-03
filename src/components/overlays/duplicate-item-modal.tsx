import { useState } from 'react'
import { DialogShell } from './dialog-shell'
import { Button } from '../inputs/button'
import { TextField } from '../inputs/text-fields'
import { Checkbox } from '../inputs/toggles'
import { FormField } from '../inputs'

export interface DuplicateItemModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; optionChecked: boolean }) => void
  defaultName: string
  submitting?: boolean
  title?: string
  nameLabel?: string
  submitLabel?: string
  submittingLabel?: string
  option?: { label: string; defaultChecked?: boolean }
}

export function DuplicateItemModal({
  open, onClose, onSubmit, defaultName, submitting,
  title = 'Duplicate item',
  nameLabel = 'New name',
  submitLabel = 'Duplicate',
  submittingLabel = 'Duplicating…',
  option,
}: DuplicateItemModalProps) {
  const [name, setName] = useState(defaultName)
  const [optionChecked, setOptionChecked] = useState(option?.defaultChecked ?? false)

  if (!open) return null
  const canSubmit = name.trim().length > 0 && !submitting

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="min(var(--ig-popup-xl), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="accent"
            disabled={!canSubmit}
            onClick={() => onSubmit({ name: name.trim(), optionChecked })}
          >
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </>
      }
    >
      <FormField label={nameLabel} htmlFor="duplicate-name">
        <TextField
          id="duplicate-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      {option ? (
        <FormField label="Options">
          <Checkbox
            checked={optionChecked}
            onChange={(e) => setOptionChecked(e.target.checked)}
            label={option.label}
          />
        </FormField>
      ) : null}
    </DialogShell>
  )
}
