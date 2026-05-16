import { DialogShell } from '../../components/overlays/dialog-shell'
import { Button } from '../../components/inputs/button'
import {
  ExportErrorText,
  ExportOption,
  ExportOptionBody,
  ExportOptionHint,
  ExportOptionRadio,
  ExportOptionTitle,
  ExportRegexInput,
  ExportSection,
  ExportSectionLabel,
} from './gallery-export-dialog.styles'

const EXPORT_DIALOG_WIDTH = 'min(440px, calc(100vw - 32px))'

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
        <ExportOption $active={range === 'selected'} $disabled={selectedCount === 0}>
          <ExportOptionRadio
            name="export-range"
            checked={range === 'selected'}
            onChange={() => setRange('selected')}
            disabled={selectedCount === 0}
          />
          <ExportOptionBody>
            <ExportOptionTitle>Selected {selectedCount} items</ExportOptionTitle>
            <ExportOptionHint>Exports only the images currently selected in the gallery.</ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
        <ExportOption $active={range === 'all'}>
          <ExportOptionRadio name="export-range" checked={range === 'all'} onChange={() => setRange('all')} />
          <ExportOptionBody>
            <ExportOptionTitle>{allRangeTitle}</ExportOptionTitle>
            <ExportOptionHint>{allRangeHint}</ExportOptionHint>
            <ExportOptionHint>Respects the current gallery filters (archive, labeled, pattern, etc.).</ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Export Type</ExportSectionLabel>
        <ExportOption $active={exportType === 'images_and_labels'}>
          <ExportOptionRadio
            name="export-type"
            checked={exportType === 'images_and_labels'}
            onChange={() => setExportType('images_and_labels')}
          />
          <ExportOptionBody>
            <ExportOptionTitle>Images + Labels</ExportOptionTitle>
            <ExportOptionHint>Packages original files with annotations.json.</ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
        <ExportOption $active={exportType === 'labels_only'}>
          <ExportOptionRadio
            name="export-type"
            checked={exportType === 'labels_only'}
            onChange={() => setExportType('labels_only')}
          />
          <ExportOptionBody>
            <ExportOptionTitle>Labels Only</ExportOptionTitle>
            <ExportOptionHint>Keeps annotation paths but excludes image binaries from the ZIP.</ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Image Format</ExportSectionLabel>
        {IMAGE_FORMAT_OPTIONS.map((opt) => (
          <ExportOption
            key={opt.value}
            $active={imageFormat === opt.value}
            onClick={() => setImageFormat(opt.value)}
          >
            <ExportOptionRadio
              name="export-image-format"
              checked={imageFormat === opt.value}
              onChange={() => setImageFormat(opt.value)}
            />
            <ExportOptionBody>
              <ExportOptionTitle>{opt.title}</ExportOptionTitle>
              <ExportOptionHint>{opt.hint}</ExportOptionHint>
            </ExportOptionBody>
          </ExportOption>
        ))}
      </ExportSection>
      <ExportSection>
        <ExportSectionLabel>Folder Grouping</ExportSectionLabel>
        <ExportOption $active={groupBy === 'none'}>
          <ExportOptionRadio name="export-group-by" checked={groupBy === 'none'} onChange={() => setGroupBy('none')} />
          <ExportOptionBody>
            <ExportOptionTitle>None (Flat)</ExportOptionTitle>
            <ExportOptionHint>모든 이미지를 images/ 아래에 한 번에 담습니다.</ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
        <ExportOption $active={groupBy === 'sequence'}>
          <ExportOptionRadio
            name="export-group-by"
            checked={groupBy === 'sequence'}
            onChange={() => setGroupBy('sequence')}
          />
          <ExportOptionBody>
            <ExportOptionTitle>Sequence</ExportOptionTitle>
            <ExportOptionHint>
              sequence_id 별로 하위 폴더 분리 (Deflectometry 시퀀스 등). sequence가 없는 이미지는 폴더 없이 저장됩니다.
            </ExportOptionHint>
          </ExportOptionBody>
        </ExportOption>
        <ExportOption $active={groupBy === 'regex'}>
          <ExportOptionRadio
            name="export-group-by"
            checked={groupBy === 'regex'}
            onChange={() => setGroupBy('regex')}
          />
          <ExportOptionBody>
            <ExportOptionTitle>Regex (파일명 패턴)</ExportOptionTitle>
            <ExportOptionHint>
              이미지 이름에서 첫 capture group 을 폴더명으로 사용. sequence_id가 있으면 그걸 우선.
            </ExportOptionHint>
            {groupBy === 'regex' ? (
              <ExportRegexInput
                value={groupKeyRegex}
                onChange={(event) => setGroupKeyRegex(event.target.value)}
                placeholder="예: ^([A-Za-z]+_\\d+)_"
                onClick={(event) => event.stopPropagation()}
              />
            ) : null}
          </ExportOptionBody>
        </ExportOption>
      </ExportSection>
      {error ? <ExportErrorText>{error}</ExportErrorText> : null}
    </DialogShell>
  )
}

const IMAGE_FORMAT_OPTIONS: { value: GalleryExportImageFormat; title: string; hint: string }[] = [
  { value: 'original', title: 'Original Format', hint: 'Restores the original file extension (PNG, JPEG, etc.).' },
  { value: 'png', title: 'PNG', hint: 'Lossless PNG. Widely compatible, larger file size.' },
  { value: 'jpg', title: 'JPEG', hint: 'Compact file size. Best for sharing and general use.' },
  { value: 'webp', title: 'WebP (Fastest)', hint: 'No conversion needed. Fastest export, smallest file size.' },
]
