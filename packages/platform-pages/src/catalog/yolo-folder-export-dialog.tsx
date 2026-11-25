import { useId, useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import {
  Alert, Button, DialogShell, FormField, ProgressBar, RadioCardGroup, TextField, type RadioCardGroupOption,
} from '@ingradient/ui/components'

const DIALOG_WIDTH = 'min(var(--ig-popup-2xl-wide), 100%)'
const DIALOG_TITLE = 'Export to folder (YOLO)'
const PATH_STYLE = { fontFamily: 'var(--ig-font-mono)', wordBreak: 'break-all' as const }

export type YoloFolderExportPhase = 'form' | 'running' | 'completed' | 'failed'
export type YoloFolderClassMode = 'keep' | 'single'

export interface YoloFolderExportPayload {
  outputDir: string
  classMode: YoloFolderClassMode
  singleClassName: string
}

export interface YoloFolderExportDialogProps {
  open: boolean
  phase: YoloFolderExportPhase
  datasetName: string
  error?: string | null
  /** 0–100, running 일 때 */
  progress?: number
  /** completed 일 때 실제로 쓴 폴더 경로 */
  outputDir?: string
  /** completed 일 때 같이 옮긴 옆 파일 이름 */
  carriedEntries?: string[]
  onClose: () => void
  onSubmit: (payload: YoloFolderExportPayload) => void
}

const CLASS_MODE_OPTIONS: RadioCardGroupOption[] = [
  { value: 'keep', label: 'Keep classes — Writes every class as it is.' },
  { value: 'single', label: 'Merge into one class — Writes every box under one class name.' },
]

/** 데이터셋 하나를 새 로컬 YOLO 폴더로 내보내는 dialog. 닫히면 입력값이 초기화된다. */
export function YoloFolderExportDialog(props: YoloFolderExportDialogProps) {
  return props.open ? <YoloFolderExportDialogBody {...props} /> : null
}

function YoloFolderExportDialogBody({
  phase, datasetName, error, progress, outputDir: writtenDir, carriedEntries = [], onClose, onSubmit,
}: YoloFolderExportDialogProps) {
  const [outputDir, setOutputDir] = useState('')
  const [classMode, setClassMode] = useState<YoloFolderClassMode>('keep')
  const [singleClassName, setSingleClassName] = useState('')
  const dirId = useId()
  const classNameId = useId()
  const payload = { outputDir: outputDir.trim(), classMode, singleClassName: singleClassName.trim() }
  const canSubmit = payload.outputDir !== '' && (classMode === 'keep' || payload.singleClassName !== '')
  const isForm = phase === 'form' || phase === 'failed'

  return (
    <DialogShell
      title={DIALOG_TITLE}
      description={isForm ? `Write "${datasetName}" to a new local folder. Existing folders are never overwritten.` : undefined}
      onClose={onClose}
      width={DIALOG_WIDTH}
      actions={
        isForm ? (
          <>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="solid" disabled={!canSubmit} onClick={() => onSubmit(payload)}>
              Export
            </Button>
          </>
        ) : (
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
        )
      }
    >
      {isForm ? (
        <Stack gap="var(--ig-spacing-16)">
          <FormField label="Output folder" htmlFor={dirId}>
            <TextField
              id={dirId}
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              placeholder="Absolute path of a new folder"
            />
          </FormField>
          <FormField label="Classes">
            <RadioCardGroup
              value={classMode}
              onChange={(value) => setClassMode(value as YoloFolderClassMode)}
              options={CLASS_MODE_OPTIONS}
            />
          </FormField>
          {classMode === 'single' ? (
            <FormField label="Class name" htmlFor={classNameId}>
              <TextField id={classNameId} value={singleClassName} onChange={(e) => setSingleClassName(e.target.value)} />
            </FormField>
          ) : null}
          {error ? <Alert $tone="danger" role="alert">{error}</Alert> : null}
        </Stack>
      ) : null}
      {phase === 'running' ? (
        <Stack gap="var(--ig-spacing-16)">
          <Text tone="secondary" size="var(--ig-font-size-sm)">Exporting…</Text>
          <ProgressBar value={progress ?? 0} />
        </Stack>
      ) : null}
      {phase === 'completed' ? (
        <Stack gap="var(--ig-spacing-16)">
          <Text tone="secondary" size="var(--ig-font-size-sm)">Export complete. Files were written to:</Text>
          <Text size="var(--ig-font-size-sm)" style={PATH_STYLE}>{writtenDir}</Text>
          {carriedEntries.length > 0 ? (
            <Text tone="secondary" size="var(--ig-font-size-sm)">Also carried over: {carriedEntries.join(', ')}</Text>
          ) : null}
        </Stack>
      ) : null}
    </DialogShell>
  )
}
