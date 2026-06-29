import { DialogShell } from '@ingradient/ui/components'
import { Button } from '@ingradient/ui/components'
import { RadioCardGroup, type RadioCardGroupOption, TextField } from '@ingradient/ui/components'
import { ExportErrorText, ExportSection, ExportSectionLabel } from './gallery-export-dialog.styles'

const EXPORT_DIALOG_WIDTH = 'min(var(--ig-popup-lg-plus), calc(100vw - var(--ig-space-13)))'

export type GalleryExportRange = 'selected' | 'all'
export type GalleryExportType = 'images_and_labels' | 'labels_only'
export type GalleryExportImageFormat = 'original' | 'png' | 'jpg' | 'webp'
export type GalleryExportGroupBy = 'none' | 'sequence' | 'regex'

export interface GalleryExportConfigDialogProps {
  open: boolean
  range: GalleryExportRange
  setRange: (value: GalleryExportRange) => void
  selectedCount: number
  exportType: GalleryExportType
  setExportType: (value: GalleryExportType) => void
  imageFormat: GalleryExportImageFormat
  setImageFormat: (value: GalleryExportImageFormat) => void
  groupBy: GalleryExportGroupBy
  setGroupBy: (value: GalleryExportGroupBy) => void
  groupKeyRegex: string
  setGroupKeyRegex: (value: string) => void
  allRangeTitle: string
  allRangeHint: string
  error?: string | null
  startPending?: boolean
  onClose: () => void
  onStart: () => void
}

/**
 * 갤러리 이미지 일괄 export 설정 dialog. Range / Type / Image format / Folder grouping 옵션.
 * Platform 의 `GalleryExportDialog` 와 시각·구조 동일.
 */
export function GalleryExportConfigDialog({
  open,
  range,
  setRange,
  selectedCount,
  exportType,
  setExportType,
  imageFormat,
  setImageFormat,
  groupBy,
  setGroupBy,
  groupKeyRegex,
  setGroupKeyRegex,
  allRangeTitle,
  allRangeHint,
  error,
  startPending = false,
  onClose,
  onStart,
}: GalleryExportConfigDialogProps) {
  if (!open) return null

  return (
    <DialogShell
      title="Export Data"
      onClose={onClose}
      width={EXPORT_DIALOG_WIDTH}
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onStart} disabled={startPending}>
            {startPending ? 'Starting…' : 'Export'}
          </Button>
        </>
      }
    >
      <ExportSection>
        <ExportSectionLabel>Range</ExportSectionLabel>
        <RadioCardGroup
          value={range}
          onChange={(value) => setRange(value as GalleryExportRange)}
          options={[
            {
              value: 'selected',
              label: `Selected ${selectedCount} items — Exports only the images currently selected in the gallery.`,
              disabled: selectedCount === 0,
            },
            {
              value: 'all',
              label: `${allRangeTitle} — ${allRangeHint} Respects the current gallery filters (archive, labeled, pattern, etc.).`,
            },
          ]}
        />
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Export Type</ExportSectionLabel>
        <RadioCardGroup
          value={exportType}
          onChange={(value) => setExportType(value as GalleryExportType)}
          options={EXPORT_TYPE_OPTIONS}
        />
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Image Format</ExportSectionLabel>
        <RadioCardGroup
          value={imageFormat}
          onChange={(value) => setImageFormat(value as GalleryExportImageFormat)}
          options={IMAGE_FORMAT_OPTIONS}
        />
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Folder Grouping</ExportSectionLabel>
        <RadioCardGroup
          value={groupBy}
          onChange={(value) => setGroupBy(value as GalleryExportGroupBy)}
          options={GROUP_BY_OPTIONS}
        />
        {groupBy === 'regex' ? (
          <TextField
            style={{ marginTop: 'var(--ig-space-3)' }}
            value={groupKeyRegex}
            onChange={(event) => setGroupKeyRegex(event.target.value)}
            placeholder="예: ^([A-Za-z]+_\\d+)_"
          />
        ) : null}
      </ExportSection>
      {error ? <ExportErrorText>{error}</ExportErrorText> : null}
    </DialogShell>
  )
}

const EXPORT_TYPE_OPTIONS: RadioCardGroupOption[] = [
  { value: 'images_and_labels', label: 'Images + Labels — Packages original files with annotations.json.' },
  {
    value: 'labels_only',
    label: 'Labels Only — Keeps annotation paths but excludes image binaries from the ZIP.',
  },
]

const IMAGE_FORMAT_OPTIONS: RadioCardGroupOption[] = [
  { value: 'original', label: 'Original Format — Restores the original file extension (PNG, JPEG, etc.).' },
  { value: 'png', label: 'PNG — Lossless PNG. Widely compatible, larger file size.' },
  { value: 'jpg', label: 'JPEG — Compact file size. Best for sharing and general use.' },
  { value: 'webp', label: 'WebP (Fastest) — No conversion needed. Fastest export, smallest file size.' },
]

const GROUP_BY_OPTIONS: RadioCardGroupOption[] = [
  { value: 'none', label: 'None (Flat) — 모든 이미지를 images/ 아래에 한 번에 담습니다.' },
  {
    value: 'sequence',
    label:
      'Sequence — sequence_id 별로 하위 폴더 분리 (Deflectometry 시퀀스 등). sequence가 없는 이미지는 폴더 없이 저장됩니다.',
  },
  {
    value: 'regex',
    label: 'Regex (파일명 패턴) — 이미지 이름에서 첫 capture group 을 폴더명으로 사용. sequence_id가 있으면 그걸 우선.',
  },
]
