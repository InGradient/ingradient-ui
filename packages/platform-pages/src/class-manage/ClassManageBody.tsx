import type { CSSProperties } from 'react'
import {
  Alert, EmptyState, FilterChipRow, IconButton, MenuIcon,
  ResizableColumnsLayout, type ResizableColumn,
} from '@ingradient/ui/components'
import { Inline } from '@ingradient/ui/primitives'
import { iconSizeNumbers, popupSizeNumbers } from '@ingradient/ui/tokens'
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
const MAPPING_WRAP_STYLE: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }
const HEADER_INLINE_STYLE: CSSProperties = { width: '100%' }

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
      width: popupSizeNumbers.md,
      resizable: true,
      minWidth: popupSizeNumbers.xs,
      maxWidth: popupSizeNumbers.xl,
      hidden: !!list.sidebarCollapsed,
    },
    { width: 'auto' },
    {
      width: popupSizeNumbers.md,
      resizable: true,
      minWidth: popupSizeNumbers.xs,
      maxWidth: popupSizeNumbers.xl,
      background: 'var(--ig-color-surface-panel)',
      hidden: !info,
    },
  ]

  const showChips = !!images.selectedClassId || !!list.sidebarCollapsed
  const chipRow = showChips ? (
    <FilterChipRow
      label="Dataset"
      items={images.datasets.map((d) => ({ id: d.id, label: d.name, count: d.image_count }))}
      activeIds={images.activeDatasetIds}
      loading={images.detailLoading}
      onToggle={images.onToggleDataset}
    />
  ) : null
  const headerSlot = showChips
    ? list.sidebarCollapsed && list.onExpand
      ? (
        <Inline gap={3} align="center" style={HEADER_INLINE_STYLE}>
          <IconButton variant="secondary" size="sm" aria-label="Expand class sidebar" onClick={list.onExpand}><MenuIcon size={iconSizeNumbers.lg} /></IconButton>
          {chipRow}
        </Inline>
      )
      : chipRow
    : undefined

  return (
    <ContentArea>
      <ResizableColumnsLayout storageKey={STORAGE_KEY} columns={columns}>
        <ClassListSidebar
          classes={list.classes}
          selectedClassId={list.selectedClassId}
          loading={list.loading}
          openMenuId={list.openMenuId}
          flush
          onSelectClass={list.onSelectClass}
          onAddClass={list.onAddClass}
          onCollapse={list.onCollapse}
          onOpenClassMenu={list.onOpenClassMenu}
        />
        <SelectableGridPanel
          selectedId={images.selectedClassId}
          noSelectionText="Select a class to see linked datasets and images."
          loadingText="Loading images…"
          emptyText="No images with this class in the selected datasets."
          flush
          headerSlot={headerSlot}
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
          showTitle={false}
        />
      }
      mappingSlot={
        <div style={MAPPING_WRAP_STYLE}>
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
