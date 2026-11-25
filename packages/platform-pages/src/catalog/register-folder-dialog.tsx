import { useId, useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import {
  Alert, Button, DialogShell, FormField, KeyValueRow, ProgressBar, Table, TextField, type TableColumn,
} from '@ingradient/ui/components'

const DIALOG_WIDTH = 'min(var(--ig-popup-2xl-wide), 100%)'
const PERCENT_MAX = 100

export type RegisterFolderPhase = 'form' | 'running' | 'completed' | 'failed'

export interface RegisterFolderClassCount {
  name: string
  boxes: number
}

export interface RegisterFolderReport {
  images: number
  boxes: number
  per_class: RegisterFolderClassCount[]
  missing_labels: string[]
  orphan_labels: string[]
}


export interface RegisterFolderDialogProps {
  open: boolean
  phase: RegisterFolderPhase
  error?: string | null
  progress?: { done: number; total: number }
  report?: RegisterFolderReport | null
  onClose: () => void
  onSubmit: (payload: { name: string; folderPath: string }) => void
}

const CLASS_COLUMNS: TableColumn<RegisterFolderClassCount>[] = [
  { key: 'name', header: 'Class', render: (row) => row.name },
  { key: 'boxes', header: 'Boxes', numeric: true, render: (row) => row.boxes.toLocaleString() },
]

/** 로컬 YOLO 폴더를 데이터셋으로 등록하는 dialog. 닫히면 입력값이 초기화된다. */
export function RegisterFolderDialog(props: RegisterFolderDialogProps) {
  return props.open ? <RegisterFolderDialogBody {...props} /> : null
}

function RegisterFolderDialogBody({ phase, error, progress, report, onClose, onSubmit }: RegisterFolderDialogProps) {
  const [name, setName] = useState('')
  const [folderPath, setFolderPath] = useState('')
  const nameId = useId()
  const pathId = useId()
  const payload = { name: name.trim(), folderPath: folderPath.trim() }
  const canSubmit = payload.name !== '' && payload.folderPath !== ''
  const isForm = phase === 'form' || phase === 'failed'
  const hasTotal = progress != null && progress.total > 0

  return (
    <DialogShell
      title="Register folder"
      description={isForm ? 'Register a local YOLO folder as a dataset. Files stay where they are.' : undefined}
      onClose={onClose}
      width={DIALOG_WIDTH}
      actions={
        isForm ? (
          <>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="solid" disabled={!canSubmit} onClick={() => onSubmit(payload)}>
              Register
            </Button>
          </>
        ) : (
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
        )
      }
    >
      {isForm ? (
        <Stack gap="var(--ig-spacing-16)">
          <FormField label="Dataset name" htmlFor={nameId}>
            <TextField id={nameId} value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="Folder path" htmlFor={pathId}>
            <TextField
              id={pathId}
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="Absolute path containing images/, labels/, classes.json"
            />
          </FormField>
          {error ? <Alert $tone="danger" role="alert">{error}</Alert> : null}
        </Stack>
      ) : null}
      {phase === 'running' ? (
        <Stack gap="var(--ig-spacing-16)">
          <Text tone="secondary" size="var(--ig-font-size-sm)">
            {hasTotal
              ? `Registering… ${progress.done.toLocaleString()} / ${progress.total.toLocaleString()}`
              : 'Registering…'}
          </Text>
          <ProgressBar indeterminate={!hasTotal} value={hasTotal ? (progress.done / progress.total) * PERCENT_MAX : 0} />
        </Stack>
      ) : null}
      {phase === 'completed' && report ? (
        <Stack gap="var(--ig-spacing-16)">
          <Stack gap="var(--ig-spacing-8)">
            <KeyValueRow label="Images" value={report.images.toLocaleString()} />
            <KeyValueRow label="Boxes" value={report.boxes.toLocaleString()} />
            {report.missing_labels.length > 0 ? (
              <KeyValueRow label="Images without labels" value={report.missing_labels.length.toLocaleString()} />
            ) : null}
            {report.orphan_labels.length > 0 ? (
              <KeyValueRow label="Labels without images" value={report.orphan_labels.length.toLocaleString()} />
            ) : null}
          </Stack>
          <Table columns={CLASS_COLUMNS} rows={report.per_class} ariaLabel="Boxes per class" />
        </Stack>
      ) : null}
    </DialogShell>
  )
}
