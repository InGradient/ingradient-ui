import { iconSizeNumbers } from '@ingradient/ui'
import type { CSSProperties } from 'react'
import {
  Alert,
  EmptyState,
  FilterChipRow,
  ResizableColumnsLayout,
  type ResizableColumn,
} from '@ingradient/ui/components'
import { popupSizeNumbers } from '@ingradient/ui/tokens'
import { ClassManageImageGrid } from './ClassManageImageGrid'
import { SelectableGridPanel } from './selectable-grid-panel'
import { ClassInfoSidebar } from './class-info-sidebar'
import { ClassListSidebar } from './class-list-sidebar'
import { ReferenceImageSection } from './reference-image-section'
import { ModelMappingSelect } from './model-mapping-select'
import { ContentArea, StatusArea } from './ClassManageView.styles'
import type {
  ClassImagesPaneProps,
  ClassInfoPaneProps,
  ClassListPaneProps,
} from './types'

interface ClassManageBodyProps {
  permissionDenied?: boolean
  error?: string | null
  noProject?: boolean
  list: ClassListPaneProps
  images: ClassImagesPaneProps
  info: ClassInfoPaneProps | null
}

const STORAGE_KEY = 'ig-class-manage-shell'

const ALERT_STYLE: CSSProperties = { margin: 'var(--ig-space-7)' }
const MAPPING_WRAP_STYLE: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 }
const MAPPING_LABEL_STYLE: CSSProperties = {
  margin: 0,
  fontSize: iconSizeNumbers.xs,
  fontWeight: 'var(--ig-font-weight-semibold)',
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: 'var(--ig-letter-spacing-normal)',
}

const PERMISSION_DENIED_TEXT = "You don't have permission to manage classes in this project."
const NO_PROJECT_TITLE = 'No project selected'
const NO_PROJECT_DESC = 'Select a project from the sidebar to manage classes.'

export function ClassManageBody({
  permissionDenied,
  error,
  noProject,
  list,
  images,
  info,
}: ClassManageBodyProps) {
  if (permissionDenied) {
    return (
      <ContentArea>
        <Alert $tone="warning" style={ALERT_STYLE}>
          {PERMISSION_DENIED_TEXT}
        </Alert>
      </ContentArea>
    )
  }
  if (error) {
    return (
      <ContentArea>
        <Alert $tone="danger" style={ALERT_STYLE}>
          {error}
        </Alert>
      </ContentArea>
    )
  }
  if (noProject) {
    return (
      <ContentArea>
        <StatusArea>
          <EmptyState title={NO_PROJECT_TITLE} description={NO_PROJECT_DESC} />
        </StatusArea>
      </ContentArea>
    )
  }

  const columns: ResizableColumn[] = [
    {
      width: popupSizeNumbers.sm,
      resizable: true,
      minWidth: popupSizeNumbers.xs,
      maxWidth: popupSizeNumbers.xl,
    },
    { width: 'auto' },
    {
      width: popupSizeNumbers.mdNarrow,
      resizable: true,
      minWidth: popupSizeNumbers.xs,
      maxWidth: popupSizeNumbers.xl,
      background: 'var(--ig-color-surface-panel)',
      hidden: !info,
    },
  ]

  return (
    <ContentArea>
      <ResizableColumnsLayout storageKey={STORAGE_KEY} columns={columns}>
        <ClassListSidebar
          classes={list.classes}
          selectedClassId={list.selectedClassId}
          loading={list.loading}
          flush
          onSelectClass={list.onSelectClass}
          onAddClass={list.onAddClass}
        />
        <SelectableGridPanel
          selectedId={images.selectedClassId}
          noSelectionText="Select a class to see linked datasets and images."
          loadingText="Loading images…"
          emptyText="No images with this class in the selected datasets."
          flush
          headerSlot={
            <FilterChipRow
              label="Dataset"
              items={images.datasets.map((d) => ({ id: d.id, label: d.name, count: d.image_count }))}
              activeIds={images.activeDatasetIds}
              loading={images.detailLoading}
              onToggle={images.onToggleDataset}
            />
          }
          loading={images.imagesLoading}
          empty={images.images.length === 0}
          gridSlot={<ClassManageImageGrid {...images} />}
        />
        {info ? <ClassInfoPane {...info} flush /> : <div />}
      </ResizableColumnsLayout>
    </ContentArea>
  )
}

function ClassInfoPane({
  selectedClass,
  isReferenceDragOver,
  referencePending,
  referenceError,
  referenceBboxCandidates,
  showCocoMapping,
  cocoMappingOptions,
  currentMapping,
  onChangeClass,
  onRandomizeColor,
  onDeleteClass,
  onSetReferenceDragOver,
  onApplyReferenceImage,
  onChangeMapping,
  flush = false,
}: ClassInfoPaneProps & { flush?: boolean }) {
  return (
    <ClassInfoSidebar
      selectedClass={selectedClass}
      onChangeName={(name) => onChangeClass({ name })}
      onChangeColor={(color) => onChangeClass({ color })}
      onChangeDescription={(description) => onChangeClass({ description: description ?? null })}
      onRandomizeColor={onRandomizeColor}
      onDelete={onDeleteClass}
      flush={flush}
      referenceImageSlot={
        <ReferenceImageSection
          imageUrl={selectedClass.reference_image_url}
          dragging={isReferenceDragOver}
          pending={referencePending}
          errorMessage={referenceError}
          candidates={referenceBboxCandidates ?? []}
          onSetDragging={onSetReferenceDragOver}
          onApply={onApplyReferenceImage}
        />
      }
      mappingSlot={
        <div style={MAPPING_WRAP_STYLE}>
          <h3 style={MAPPING_LABEL_STYLE}>Model mapping</h3>
          <ModelMappingSelect
            enabled={!!showCocoMapping}
            options={[...cocoMappingOptions]}
            value={currentMapping}
            onChange={onChangeMapping}
          />
        </div>
      }
    />
  )
}
