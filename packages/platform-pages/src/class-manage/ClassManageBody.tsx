import type { CSSProperties } from 'react'
import { Alert, EmptyState } from '@ingradient/ui/components'
import {
  CatalogShell,
  ClassImagesPanel,
  ClassInfoSidebar,
  ClassListSidebar,
  DatasetFilterChipRow,
  ModelMappingSelect,
  ReferenceImageSection,
} from '@ingradient/ui/patterns'
import { ClassManageImageGrid } from './ClassManageImageGrid'
import { ContentArea, StatusArea } from './ClassManageView.styles'
import type { ClassImagesPaneProps, ClassInfoPaneProps, ClassListPaneProps } from './types'

interface ClassManageBodyProps {
  permissionDenied?: boolean
  error?: string | null
  noProject?: boolean
  list: ClassListPaneProps
  images: ClassImagesPaneProps
  info: ClassInfoPaneProps | null
}

const ALERT_STYLE: CSSProperties = { margin: 'var(--ig-space-7)' }
const MAPPING_WRAP_STYLE: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 }
const MAPPING_LABEL_STYLE: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const PERMISSION_DENIED_TEXT = "You don't have permission to manage classes in this project."
const NO_PROJECT_TITLE = 'No project selected'
const NO_PROJECT_DESC = 'Select a project from the sidebar to manage classes.'
const STORAGE_KEY = 'ig-class-manage-shell'

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

  return (
    <ContentArea>
      <CatalogShell
        storageKey={STORAGE_KEY}
        leftSidebar={
          <ClassListSidebar
            classes={list.classes}
            selectedClassId={list.selectedClassId}
            loading={list.loading}
            flush
            onSelectClass={list.onSelectClass}
            onAddClass={list.onAddClass}
          />
        }
        body={
          <ClassImagesPanel
            selectedClassId={images.selectedClassId}
            chipsRow={
              <DatasetFilterChipRow
                datasets={images.datasets}
                activeIds={images.activeDatasetIds}
                loading={images.detailLoading}
                onToggle={images.onToggleDataset}
              />
            }
            imagesLoading={images.imagesLoading}
            imagesEmpty={images.images.length === 0}
            flush
            grid={<ClassManageImageGrid {...images} />}
          />
        }
        rightSidebar={info ? <ClassInfoPane {...info} flush /> : undefined}
      />
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
