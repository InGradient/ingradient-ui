import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { DropdownSelect } from '@ingradient/ui/components'
import { DialogRow } from './gallery-export-dialog.styles'

export type DatasetTransferAction = 'copy' | 'move'

export interface DatasetTransferOption {
  id: string
  name: string
}

export interface GalleryDatasetTransferDialogProps {
  /** Active action — null means closed. */
  action: DatasetTransferAction | null
  setAction: (value: DatasetTransferAction | null) => void
  datasets: DatasetTransferOption[]
  sourceId: string
  setSourceId: (value: string) => void
  targetId: string
  setTargetId: (value: string) => void
  copyPending?: boolean
  movePending?: boolean
  onCopy: () => void
  onMove: () => void
}

/**
 * 갤러리 선택 이미지를 다른 dataset 으로 copy / move 하는 dialog.
 * Platform 의 `GalleryDatasetTransferDialog` 와 시각·구조 동일.
 */
export function GalleryDatasetTransferDialog({
  action,
  setAction,
  datasets,
  sourceId,
  setSourceId,
  targetId,
  setTargetId,
  copyPending = false,
  movePending = false,
  onCopy,
  onMove,
}: GalleryDatasetTransferDialogProps) {
  if (!action) return null
  const pending = copyPending || movePending
  const disabled =
    !targetId || (action === 'move' && (!sourceId || sourceId === targetId)) || pending
  const options = [{ value: '', label: 'Select' }, ...datasets.map((d) => ({ value: d.id, label: d.name }))]

  return (
    <DialogShell
      title={action === 'copy' ? 'Copy to dataset' : 'Move to dataset'}
      onClose={() => setAction(null)}
      width="360px"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={() => setAction(null)}>
            Cancel
          </Button>
          <Button type="button" disabled={disabled} onClick={action === 'copy' ? onCopy : onMove}>
            {pending ? '…' : action === 'copy' ? 'Copy' : 'Move'}
          </Button>
        </>
      }
    >
      {action === 'move' ? (
        <DialogRow>
          <label htmlFor="dataset-source">From dataset</label>
          <DropdownSelect value={sourceId} options={options} onChange={setSourceId} />
        </DialogRow>
      ) : null}
      <DialogRow>
        <label htmlFor="dataset-target">To dataset</label>
        <DropdownSelect value={targetId} options={options} onChange={setTargetId} />
      </DialogRow>
    </DialogShell>
  )
}
