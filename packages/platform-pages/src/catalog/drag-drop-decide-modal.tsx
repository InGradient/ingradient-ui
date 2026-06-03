import React, { useState } from 'react'
import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { RadioCardGroup } from '@ingradient/ui/components'

export type DragDropAction = 'copy' | 'move'

export interface DragDropDecideModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (action: DragDropAction) => void
  sourceDatasetName?: string
  targetDatasetName?: string
  itemCount?: number
  defaultAction?: DragDropAction
}

export function DragDropDecideModal({
  open, onClose, onConfirm, sourceDatasetName, targetDatasetName, itemCount, defaultAction = 'copy',
}: DragDropDecideModalProps) {
  const [action, setAction] = useState<DragDropAction>(defaultAction)
  if (!open) return null

  const countText = typeof itemCount === 'number' ? `${itemCount.toLocaleString()} image${itemCount === 1 ? '' : 's'}` : 'these images'
  const desc = sourceDatasetName && targetDatasetName
    ? `Move or copy ${countText} from "${sourceDatasetName}" to "${targetDatasetName}"?`
    : `Move or copy ${countText} to the target dataset?`

  return (
    <DialogShell
      title="Move or copy?"
      description={desc}
      onClose={onClose}
      width="min(var(--ig-popup-xl), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="accent" onClick={() => onConfirm(action)}>Confirm</Button>
        </>
      }
    >
      <RadioCardGroup
        value={action}
        onChange={(v) => setAction(v as DragDropAction)}
        options={[
          { value: 'copy', label: 'Copy — keep originals in source' },
          { value: 'move', label: 'Move — remove from source' },
        ]}
      />
    </DialogShell>
  )
}
