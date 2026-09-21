import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { Button, CheckboxGroup, DialogShell, RadioCardGroup, TextField } from '@ingradient/ui'
import { InlineError } from './AddDatasetModalView.styles'
import type { AddDatasetModalViewProps, EdgeTaskType } from './types'

const FIELD_LABEL_STYLE: CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  fontWeight: 'var(--ig-font-weight-medium)',
  color: 'var(--ig-color-text-muted)',
}

const FIELD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-2)',
}

const TASK_TYPES: EdgeTaskType[] = ['classification', 'object_detection', 'segmentation', 'point']

export function AddDatasetModalView(props: AddDatasetModalViewProps): JSX.Element {
  const {
    name, taskType, selectedClassIds, allClasses, namePlaceholder,
    adding, error, labels,
    onNameChange, onTaskTypeChange, onClassesChange, onSubmit, onClose, nameInputRef,
  } = props
  const localNameRef = useRef<HTMLInputElement>(null)
  const inputRef = nameInputRef ?? localNameRef
  // Run after DialogShell captures the opener. Native autoFocus runs during commit,
  // causing the shell to remember this soon-to-be-removed input instead of the opener.
  useEffect(() => { inputRef.current?.focus() }, [inputRef])
  const id = useId()
  const formId = `${id}-form`
  const nameId = `${id}-name`
  const errorId = `${id}-error`
  return (
    <DialogShell
      title={labels.title}
      onClose={onClose}
      width="var(--ig-popup-md)"
      actions={
        <>
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            {labels.cancel}
          </Button>
          <Button variant="accent" size="sm" type="submit" form={formId} disabled={adding}>
            {adding ? labels.adding : labels.add}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        aria-busy={adding}
        onSubmit={(event) => { if (adding) event.preventDefault(); else onSubmit(event) }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-7)' }}
      >
        <div style={FIELD_STYLE}>
          <label htmlFor={nameId} style={FIELD_LABEL_STYLE}>{labels.datasetNameLabel}</label>
          <TextField
            id={nameId}
            disabled={adding}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            ref={inputRef}
            type="text"
            placeholder={namePlaceholder}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div role="group" aria-labelledby={`${id}-task`} style={FIELD_STYLE}>
          <span id={`${id}-task`} style={FIELD_LABEL_STYLE}>{labels.taskTypeLabel}</span>
          <RadioCardGroup
            value={taskType}
            onChange={(v) => onTaskTypeChange(v as EdgeTaskType)}
            options={TASK_TYPES.map((type) => ({
              value: type,
              label: labels.taskTypeOptions[type],
              disabled: adding || type !== 'object_detection',
            }))}
          />
        </div>
        {allClasses.length > 0 && (
          <div role="group" aria-labelledby={`${id}-classes`} style={FIELD_STYLE}>
            <span id={`${id}-classes`} style={FIELD_LABEL_STYLE}>{labels.classesLabel(selectedClassIds.size, allClasses.length)}</span>
            <CheckboxGroup
              items={allClasses.map((cls) => ({ id: cls.class_id, label: cls.class_name, color: cls.color }))}
              selectedIds={selectedClassIds}
              onChange={(ids) => { if (!adding) onClassesChange(ids) }}
            />
          </div>
        )}
        {error && <InlineError id={errorId} role="alert">{error}</InlineError>}
      </form>
    </DialogShell>
  )
}
