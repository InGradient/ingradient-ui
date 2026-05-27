import type { CSSProperties } from 'react'
import {
  Alert,
  Badge,
  EmptyState,
  FilterChipRow,
} from '@ingradient/ui/components'
import { AnnotationOverlay, ImageGrid, SelectableGridPanel } from '@ingradient/ui/patterns'
import { ClassInfoSidebar } from './class-info-sidebar'
import { ClassListSidebar } from './class-list-sidebar'
import { ReferenceImageSection } from './reference-image-section'
import { ModelMappingSelect } from './model-mapping-select'
import { BodyRow } from './ClassManageView.styles'
import type {
  ClassImage,
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

const ALERT_STYLE: CSSProperties = { flex: 1 }
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
      <BodyRow>
        <Alert $tone="warning" style={ALERT_STYLE}>
          {PERMISSION_DENIED_TEXT}
        </Alert>
      </BodyRow>
    )
  }
  if (error) {
    return (
      <BodyRow>
        <Alert $tone="danger" style={ALERT_STYLE}>
          {error}
        </Alert>
      </BodyRow>
    )
  }
  if (noProject) {
    return (
      <BodyRow>
        <EmptyState title={NO_PROJECT_TITLE} description={NO_PROJECT_DESC} />
      </BodyRow>
    )
  }

  return (
    <BodyRow>
      <ClassListSidebar
        classes={list.classes}
        selectedClassId={list.selectedClassId}
        loading={list.loading}
        onSelectClass={list.onSelectClass}
        onAddClass={list.onAddClass}
      />
      <SelectableGridPanel
        selectedId={images.selectedClassId}
        noSelectionText="Select a class to see linked datasets and images."
        loadingText="Loading images…"
        emptyText="No images with this class in the selected datasets."
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
        gridSlot={
          <ImageGrid
            items={images.images}
            getThumbnailUrl={(img) => img.thumb_url}
            layout={{ minWidth: 120, gap: 4 }}
            onItemClick={(img) => images.onOpenImage(img)}
            onContextMenu={(img, _i, e) => {
              e.preventDefault()
              images.onOpenContextMenu(img, { top: e.clientY, left: e.clientX })
            }}
            onDragStart={(img, _i, e) => {
              e.dataTransfer.setData('text/plain', img.id)
              e.dataTransfer.effectAllowed = 'copy'
            }}
            renderCellOverlay={(img) => (
              <AnnotationOverlay
                bboxes={img.bboxes}
                points={img.points}
                getColor={(id) => (id ? images.classIdToColor[id] : undefined)}
                selectedClassId={images.selectedClassId}
                imageWidth={img.width}
                imageHeight={img.height}
                fillOpacity={0.22}
                emphasize
              />
            )}
            renderCellTopRight={(img: ClassImage) =>
              img.sequence_id ? <Badge $tone="neutral">4</Badge> : null
            }
          />
        }
      />
      {info ? <ClassInfoPane {...info} /> : null}
    </BodyRow>
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
}: ClassInfoPaneProps) {
  return (
    <ClassInfoSidebar
      selectedClass={selectedClass}
      onChangeName={(name) => onChangeClass({ name })}
      onChangeColor={(color) => onChangeClass({ color })}
      onChangeDescription={(description) => onChangeClass({ description: description ?? null })}
      onRandomizeColor={onRandomizeColor}
      onDelete={onDeleteClass}
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
