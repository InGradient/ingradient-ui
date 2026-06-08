import { ConfirmDialog, ContextMenuWithSubmenus, DuplicateItemModal } from '@ingradient/ui/components'
import { AddDatasetModal } from '@ingradient/ui/patterns'
import { DragDropDecideModal } from './drag-drop-decide-modal'
import { ExportProgressModal } from './export-progress-modal'
import { UploadQualityModal } from './upload-quality-modal'
import {
  GalleryDatasetTransferDialog,
  GalleryDeleteDialog,
  GalleryDetailModal,
  GalleryExportConfigDialog,
  GalleryExportProgressDialog,
  GalleryImageMenu,
} from './gallery'
import type { CatalogOverlaysProps } from './types'
import type { ReactNode } from 'react'

interface Props extends CatalogOverlaysProps {
  detailContent?: { main?: ReactNode; sidebar?: ReactNode }
}

export function CatalogOverlays({
  imageMenu,
  datasetMenu,
  detail,
  addDataset,
  duplicateDataset,
  dragDrop,
  igpExport,
  uploadQuality,
  pendingClassRemoval,
  pendingMemberRemoval,
  pendingDatasetDeletion,
  bulkDelete,
  exportConfig,
  exportProgress,
  datasetTransfer,
  detailContent,
}: Props) {
  return (
    <>
      <GalleryImageMenu
        anchorEl={imageMenu.anchorEl}
        onClose={imageMenu.onClose}
        datasets={imageMenu.datasets.map((d) => ({ id: d.id, name: d.name }))}
        clipboardHasImages={imageMenu.clipboardHasImages}
        archived={imageMenu.archived}
        defaultOpenSubmenuKey={imageMenu.defaultOpenSubmenuKey}
        onCopyTo={imageMenu.onCopyTo}
        onMoveTo={imageMenu.onMoveTo}
        onArchive={imageMenu.onArchive}
        onUnarchive={imageMenu.onUnarchive}
        onDelete={imageMenu.onDelete}
        onOpenLabeling={imageMenu.onOpenLabeling}
      />
      <ContextMenuWithSubmenus
        anchorEl={datasetMenu.anchorEl}
        onClose={datasetMenu.onClose}
        actions={[
          { key: 'rename', label: 'Rename', onClick: datasetMenu.onRename },
          { key: 'dup', label: 'Duplicate', onClick: datasetMenu.onDuplicate },
          { key: 'export', label: 'Export', onClick: datasetMenu.onExport },
          { key: 'delete', label: 'Delete', tone: 'danger', onClick: datasetMenu.onDelete },
        ]}
      />
      <GalleryDetailModal
        image={detail.image}
        open={detail.open}
        onClose={detail.onClose}
        main={detailContent?.main}
        sidebar={detailContent?.sidebar}
        hideDefaultClose={!!detailContent?.main}
      />
      <AddDatasetModal
        open={addDataset.open}
        onClose={addDataset.onClose}
        onSubmit={addDataset.onSubmit}
        classes={addDataset.classes.map((c) => ({ id: c.id, name: c.name, color: c.color }))}
      />
      <DuplicateItemModal
        open={!!duplicateDataset.datasetId}
        onClose={duplicateDataset.onClose}
        onSubmit={duplicateDataset.onSubmit}
        defaultName={duplicateDataset.defaultName}
        title="Duplicate dataset"
        option={{ label: 'Copy labels and annotations', defaultChecked: true }}
      />
      <DragDropDecideModal
        open={dragDrop.open}
        onClose={dragDrop.onClose}
        onConfirm={dragDrop.onConfirm}
        sourceDatasetName={dragDrop.sourceDatasetName}
        targetDatasetName={dragDrop.targetDatasetName}
        itemCount={dragDrop.itemCount}
      />
      <ExportProgressModal
        open={igpExport.open}
        onClose={igpExport.onClose}
        phase={igpExport.phase}
        progress={igpExport.progress}
        downloadUrl={igpExport.downloadUrl}
        filename={igpExport.filename}
        title="Export (.igp)"
        description="Export the dataset as a single .igp archive containing images, labels, and metadata."
        phaseLabel={{ processing: 'Compressing files…' }}
      />
      <UploadQualityModal
        open={uploadQuality.open}
        onClose={uploadQuality.onClose}
        onConfirm={uploadQuality.onConfirm}
        fileCount={uploadQuality.fileCount}
      />
      {pendingClassRemoval.className !== undefined ? (
        <ConfirmDialog
          title="Remove class?"
          description={`Remove class "${pendingClassRemoval.className}" from this dataset? Annotations using this class will be detached.`}
          confirmLabel="Remove"
          danger
          onCancel={pendingClassRemoval.onCancel}
          onConfirm={pendingClassRemoval.onConfirm}
        />
      ) : null}
      {pendingMemberRemoval.open ? (
        <ConfirmDialog
          title="Remove member?"
          description="Remove this member from the dataset. They will lose access to annotations."
          confirmLabel="Remove"
          danger
          onCancel={pendingMemberRemoval.onCancel}
          onConfirm={pendingMemberRemoval.onConfirm}
        />
      ) : null}
      {pendingDatasetDeletion.datasetName !== undefined ? (
        <ConfirmDialog
          title="Delete dataset?"
          description={`Delete "${pendingDatasetDeletion.datasetName}"? Images and labels in this dataset will be removed.`}
          confirmLabel="Delete"
          danger
          onCancel={pendingDatasetDeletion.onCancel}
          onConfirm={pendingDatasetDeletion.onConfirm}
        />
      ) : null}
      <GalleryDeleteDialog
        open={bulkDelete.open}
        title={bulkDelete.title}
        description={bulkDelete.description}
        confirmLabel={bulkDelete.confirmLabel}
        error={bulkDelete.error}
        isDeleting={bulkDelete.isDeleting}
        onClose={bulkDelete.onClose}
        onConfirm={bulkDelete.onConfirm}
      />
      <GalleryExportConfigDialog
        open={exportConfig.open}
        range={exportConfig.range}
        setRange={exportConfig.onRangeChange}
        exportType={exportConfig.exportType}
        setExportType={exportConfig.onExportTypeChange}
        imageFormat={exportConfig.imageFormat}
        setImageFormat={exportConfig.onImageFormatChange}
        groupBy={exportConfig.groupBy}
        setGroupBy={exportConfig.onGroupByChange}
        groupKeyRegex={exportConfig.groupKeyRegex}
        setGroupKeyRegex={exportConfig.onGroupKeyRegexChange}
        selectedCount={exportConfig.selectedCount}
        allRangeTitle={exportConfig.allRangeTitle}
        allRangeHint={exportConfig.allRangeHint}
        error={exportConfig.error}
        startPending={exportConfig.startPending}
        onClose={exportConfig.onClose}
        onStart={exportConfig.onStart}
      />
      <GalleryExportProgressDialog
        open={exportProgress.open}
        jobId={exportProgress.jobId}
        job={exportProgress.job}
        jobLoading={exportProgress.jobLoading}
        downloadedJobId={exportProgress.downloadedJobId}
        downloadingJobId={exportProgress.downloadingJobId}
        error={exportProgress.error}
        onClose={exportProgress.onClose}
        onDownloadAgain={exportProgress.onDownloadAgain}
      />
      <GalleryDatasetTransferDialog
        action={datasetTransfer.action}
        setAction={datasetTransfer.onActionChange}
        datasets={datasetTransfer.datasets.map((d) => ({ id: d.id, name: d.name }))}
        sourceId={datasetTransfer.sourceId}
        setSourceId={datasetTransfer.onSourceChange}
        targetId={datasetTransfer.targetId}
        setTargetId={datasetTransfer.onTargetChange}
        copyPending={datasetTransfer.copyPending}
        movePending={datasetTransfer.movePending}
        onCopy={datasetTransfer.onCopy}
        onMove={datasetTransfer.onMove}
      />
    </>
  )
}
