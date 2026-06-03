import React, { useState } from 'react'
import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { RadioCardGroup, type RadioCardGroupOption } from '@ingradient/ui/components'

export type UploadQuality = 'high' | 'medium' | 'low' | 'lossless'

export interface UploadQualityModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (quality: UploadQuality) => void
  fileCount?: number
  defaultQuality?: UploadQuality
  submitting?: boolean
}

const OPTIONS: RadioCardGroupOption[] = [
  { value: 'high', label: 'High quality (recommended)' },
  { value: 'medium', label: 'Medium quality' },
  { value: 'low', label: 'Low quality' },
  { value: 'lossless', label: 'Lossless (original)' },
]

export function UploadQualityModal({
  open, onClose, onConfirm, fileCount, defaultQuality = 'high', submitting,
}: UploadQualityModalProps) {
  const [quality, setQuality] = useState<UploadQuality>(defaultQuality)
  if (!open) return null

  const desc = typeof fileCount === 'number'
    ? `Choose upload quality for ${fileCount.toLocaleString()} image${fileCount === 1 ? '' : 's'}.`
    : 'Choose upload quality.'

  return (
    <DialogShell
      title="Upload quality"
      description={desc}
      onClose={onClose}
      width="min(var(--ig-popup-xl), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="accent" disabled={submitting} onClick={() => onConfirm(quality)}>
            {submitting ? 'Uploading…' : 'Upload'}
          </Button>
        </>
      }
    >
      <RadioCardGroup
        value={quality}
        onChange={(v) => setQuality(v as UploadQuality)}
        options={OPTIONS}
      />
    </DialogShell>
  )
}
