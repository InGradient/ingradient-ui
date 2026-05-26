import type { CSSProperties } from 'react'
import { Button, CheckboxGroup, DialogShell, RadioCardGroup, TextField } from '@ingradient/ui'
import { InlineError } from './AddDatasetModalView.styles'
import type { AddDatasetModalViewProps, EdgeTaskType } from './types'

const FIELD_LABEL_STYLE: CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  fontWeight: 500,
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
  return (
    <DialogShell
      title={labels.title}
      onClose={onClose}
      width="320px"
      actions={
        <>
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            {labels.cancel}
          </Button>
          <Button variant="accent" size="sm" type="submit" form="add-dataset-form" disabled={adding}>
            {adding ? labels.adding : labels.add}
          </Button>
        </>
      }
    >
      <form
        id="add-dataset-form"
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-7)' }}
      >
        <div style={FIELD_STYLE}>
          <label style={FIELD_LABEL_STYLE}>{labels.datasetNameLabel}</label>
          <TextField
            ref={nameInputRef}
            type="text"
            placeholder={namePlaceholder}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
          />
        </div>
        <div style={FIELD_STYLE}>
          <label style={FIELD_LABEL_STYLE}>{labels.taskTypeLabel}</label>
          <RadioCardGroup
            value={taskType}
            onChange={(v) => onTaskTypeChange(v as EdgeTaskType)}
            options={TASK_TYPES.map((type) => ({
              value: type,
              label: labels.taskTypeOptions[type],
              disabled: type !== 'object_detection',
            }))}
          />
        </div>
        {allClasses.length > 0 && (
          <div style={FIELD_STYLE}>
            <label style={FIELD_LABEL_STYLE}>{labels.classesLabel(selectedClassIds.size, allClasses.length)}</label>
            <CheckboxGroup
              items={allClasses.map((cls) => ({ id: cls.class_id, label: cls.class_name, color: cls.color }))}
              selectedIds={selectedClassIds}
              onChange={onClassesChange}
            />
          </div>
        )}
        {error && <InlineError>{error}</InlineError>}
      </form>
    </DialogShell>
  )
}
