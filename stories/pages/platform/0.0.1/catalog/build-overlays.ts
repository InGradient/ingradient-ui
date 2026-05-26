import type { CatalogOverlaysProps } from '@ingradient/platform-pages'
import type { CatalogScene } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import type { useCatalogScene } from './use-catalog-scene'

export function buildCatalogOverlays(
  scenario: CatalogScene,
  s: ReturnType<typeof useCatalogScene>,
): CatalogOverlaysProps {
  const classes = scenario.classes ?? []
  const currentImage = scenario.images.find(
    (img) => img.id === (s.detailImageId ?? scenario.detailImageId),
  )
  const pendingClassName = classes.find((c) => c.id === s.pendingClassRemovalId)?.name
  const pendingDatasetName = scenario.datasets.find((d) => d.id === s.pendingDatasetDeletionId)?.name
  const duplicateDatasetName =
    scenario.datasets.find((d) => d.id === s.duplicateDatasetId)?.name ?? 'Dataset'

  return {
    imageMenu: {
      anchorEl: s.imageMenuAnchor?.el ?? null,
      datasets: scenario.datasets,
      clipboardHasImages: scenario.clipboardHasImages,
      archived: scenario.imageIsArchived,
      defaultOpenSubmenuKey: scenario.imageMenuSubmenu,
      onClose: s.closeImageMenu,
      onCopyTo: () => s.closeImageMenu(),
      onMoveTo: () => s.closeImageMenu(),
    },
    datasetMenu: {
      anchorEl: s.datasetMenuAnchor?.el ?? null,
      onClose: s.closeDatasetMenu,
      onRename: () => undefined,
      onDuplicate: () => s.setDuplicateDatasetId(s.datasetMenuAnchor?.id),
      onExport: () => s.setIgpExportOpen(true),
      onDelete: () => s.setPendingDatasetDeletionId(s.datasetMenuAnchor?.id),
    },
    detail: {
      image: currentImage ?? null,
      open: !!s.detailImageId,
      onClose: () => s.setDetailImageId(undefined),
    },
    addDataset: {
      open: s.addDatasetOpen,
      classes,
      onClose: () => s.setAddDatasetOpen(false),
      onSubmit: () => s.setAddDatasetOpen(false),
    },
    duplicateDataset: {
      datasetId: s.duplicateDatasetId,
      defaultName: `${duplicateDatasetName} — copy`,
      onClose: () => s.setDuplicateDatasetId(undefined),
      onSubmit: () => s.setDuplicateDatasetId(undefined),
    },
    dragDrop: {
      open: s.dragDropOpen,
      sourceDatasetName: 'Wafer line A',
      targetDatasetName: 'Surface defects',
      itemCount: s.selectedImageIds.size || 12,
      onClose: () => s.setDragDropOpen(false),
      onConfirm: () => s.setDragDropOpen(false),
    },
    igpExport: {
      open: s.igpExportOpen,
      phase: s.igpExportPhase,
      progress: s.igpExportPhase === 'processing' ? 64 : 0,
      downloadUrl: s.igpExportPhase === 'ready' ? '#' : undefined,
      filename: 'wafer-batch.igp',
      onClose: () => s.setIgpExportOpen(false),
    },
    uploadQuality: {
      open: s.uploadQualityOpen,
      fileCount: 12,
      onClose: () => s.setUploadQualityOpen(false),
      onConfirm: () => s.setUploadQualityOpen(false),
    },
    pendingClassRemoval: {
      className: pendingClassName,
      onCancel: () => s.setPendingClassRemovalId(undefined),
      onConfirm: () => s.setPendingClassRemovalId(undefined),
    },
    pendingMemberRemoval: {
      open: !!s.pendingMemberRemovalId,
      onCancel: () => s.setPendingMemberRemovalId(undefined),
      onConfirm: () => s.setPendingMemberRemovalId(undefined),
    },
    pendingDatasetDeletion: {
      datasetName: pendingDatasetName,
      onCancel: () => s.setPendingDatasetDeletionId(undefined),
      onConfirm: () => s.setPendingDatasetDeletionId(undefined),
    },
    bulkDelete: {
      open: s.extra.bulkDeleteOpen,
      title: s.selectedImageIds.size > 1 ? `Delete ${s.selectedImageIds.size} images` : 'Delete image',
      description:
        s.selectedImageIds.size > 1
          ? `Permanently delete the ${s.selectedImageIds.size} selected images? This cannot be undone.`
          : 'Permanently delete this image? This cannot be undone.',
      confirmLabel: s.selectedImageIds.size > 1 ? `Delete ${s.selectedImageIds.size} images` : 'Delete',
      onClose: () => s.extra.setBulkDeleteOpen(false),
      onConfirm: () => s.extra.setBulkDeleteOpen(false),
    },
    exportConfig: {
      open: s.extra.exportConfigOpen,
      range: s.extra.exportRange,
      exportType: s.extra.exportType,
      imageFormat: s.extra.exportImageFormat,
      groupBy: s.extra.exportGroupBy,
      groupKeyRegex: s.extra.exportGroupKeyRegex,
      selectedCount: s.selectedImageIds.size,
      allRangeTitle: `All filtered images (${scenario.images.length.toLocaleString()})`,
      allRangeHint: 'Includes every image returned by current filters.',
      onRangeChange: s.extra.setExportRange,
      onExportTypeChange: s.extra.setExportType,
      onImageFormatChange: s.extra.setExportImageFormat,
      onGroupByChange: s.extra.setExportGroupBy,
      onGroupKeyRegexChange: s.extra.setExportGroupKeyRegex,
      onClose: () => s.extra.setExportConfigOpen(false),
      onStart: () => s.extra.setExportConfigOpen(false),
    },
    exportProgress: {
      open: s.extra.exportProgressOpen,
      jobId: s.extra.exportProgressOpen ? 'job_demo' : null,
      job: s.extra.exportProgressJob,
      onClose: () => s.extra.setExportProgressOpen(false),
      onDownloadAgain: () => undefined,
    },
    datasetTransfer: {
      action: s.extra.transferAction,
      datasets: scenario.datasets,
      sourceId: s.extra.transferSourceId,
      targetId: s.extra.transferTargetId,
      onActionChange: s.extra.setTransferAction,
      onSourceChange: s.extra.setTransferSourceId,
      onTargetChange: s.extra.setTransferTargetId,
      onCopy: () => s.extra.setTransferAction(null),
      onMove: () => s.extra.setTransferAction(null),
    },
  }
}
