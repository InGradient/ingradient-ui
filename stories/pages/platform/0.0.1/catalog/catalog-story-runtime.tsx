import React from 'react'
import { fn } from 'storybook/test'
import {
  CatalogView,
  type CatalogOverlaysProps,
  type CatalogToolbarPaneProps,
  type CatalogViewMode,
  type CatalogViewProps,
} from '@ingradient/platform-pages'
import { breakpoints } from '@ingradient/ui/tokens'
import {
  catalogScenarios,
  type CatalogScenarioKey,
} from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import { defineHandoff } from '../../../../support/handoff'
import { buildCatalogViewProps } from './build-view-props'
import { useCatalogScene } from './use-catalog-scene'

export interface CatalogStoryActions {
  onDatasetChange: (datasetId: string) => void
  onDatasetSelectionChange: (datasetId: string, checked: boolean) => void
  onSearchChange: (value: string) => void
  onFilterAction: (action: string) => void
  onSortChange: (value: string) => void
  onViewModeChange: (mode: CatalogViewMode) => void
  onImageSelectionChange: (imageId: string, checked: boolean) => void
  onImageDetailOpen: (imageId: string) => void
  onImageActionsOpen: (imageId: string) => void
  onDatasetActionsOpen: (datasetId: string) => void
  onDeleteRequested: () => void
  onExportRequested: () => void
  onUploadRequested: () => void
  onMobileControlChange: (control: string, value: string | boolean | null) => void
  onClassChange: (action: 'add' | 'remove', classId: string) => void
  onMemberRemove: (memberId: string) => void
  onImageAction: (action: string, targetId?: string) => void
  onDatasetAction: (action: string) => void
  onDialogAction: (dialog: string, action: string) => void
}

export interface CatalogStoryArgs extends CatalogStoryActions {
  scenario: CatalogScenarioKey
}

export const CATALOG_SCENARIO_LABELS: Record<CatalogScenarioKey, string> = {
  default: 'Populated workspace',
  'empty-datasets': 'No datasets',
  'empty-images': 'No images',
  'loading-datasets': 'Datasets loading',
  'loading-images': 'Images loading',
  error: 'Image load error',
  'permission-denied': 'Access denied',
  'no-project': 'No project selected',
  'many-images': 'Large image set',
  'long-text': 'Long image names',
  'multi-selection': 'Images selected',
  'filter-active': 'Active filters applied',
  'filter-open': 'Filter panel open',
  'sort-open': 'Sort menu open',
  'image-menu-open': 'Image actions menu open',
  'dataset-menu-open': 'Dataset actions menu open',
  'drag-over-sidebar': 'Drop on dataset',
  'drag-over-grid': 'Drop on image gallery',
  'drag-over-full': 'Page dropzone active',
  'sidebar-collapsed': 'Dataset sidebar collapsed',
  'table-view': 'Image table',
  'stats-view': 'Analytics overview',
  'stats-empty': 'Analytics empty state',
  'right-empty-classes': 'Dataset details without classes',
  'right-loading': 'Dataset details loading',
  'dataset-details-overflow': 'Dataset details overflow',
  'modal-add-dataset': 'Add dataset dialog',
  'modal-igp-export-progress': 'Dataset IGP export',
  'modal-upload-quality': 'Upload quality dialog',
  'modal-bulk-delete': 'Delete images dialog',
  'modal-export-config': 'Gallery export dialog',
  'modal-transfer-move': 'Transfer images dialog',
  'upload-in-progress': 'Upload in progress',
  'detail-with-comments': 'Image inspector with comments',
  'mobile-default': 'Mobile workspace',
  'mobile-dataset-dropdown-open': 'Mobile dataset selector open',
  'mobile-bottom-filter': 'Mobile filter sheet open',
  'mobile-bottom-sort': 'Mobile sort sheet open',
}

const catalogHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Dataset Catalog',
  referenceStory: 'Pages / Platform / 0.0.1 / Dataset Catalog / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/catalog-{datasets,images,scenarios}.ts',
  requiredScenarios: [
    'default',
    'empty-images',
    'loading-images',
    'permission-denied',
    'multi-selection',
    'filter-active',
    'table-view',
    'stats-view',
    'detail-with-comments',
    'mobile-bottom-filter',
    'mobile-bottom-sort',
  ],
  interactions: [
    'dataset 선택 → current dataset 변경 + image list 갱신',
    'search / filter / sort 변경 → visible image list 갱신',
    'select all → visible images 선택 + bulk delete 확인 dialog',
    'image 카드 클릭 → image inspector',
    'mobile bottom toolbar → Filter / Sort sheet 전환',
  ],
  platformIntegration: [
    'CatalogView 를 그대로 import — props 에 hook 결과 연결',
    'datasets → useCatalogDatasets()',
    'images → useGalleryImageList()',
    'selectedDatasetIds / currentDatasetId → useCatalogPageUiState()',
    'image menu actions → useGalleryImageMenu / mutations',
  ],
})

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

export function createCatalogActionArgs(): CatalogStoryActions {
  return {
    onDatasetChange: fn<(datasetId: string) => void>(),
    onDatasetSelectionChange: fn<(datasetId: string, checked: boolean) => void>(),
    onSearchChange: fn<(value: string) => void>(),
    onFilterAction: fn<(action: string) => void>(),
    onSortChange: fn<(value: string) => void>(),
    onViewModeChange: fn<(mode: CatalogViewMode) => void>(),
    onImageSelectionChange: fn<(imageId: string, checked: boolean) => void>(),
    onImageDetailOpen: fn<(imageId: string) => void>(),
    onImageActionsOpen: fn<(imageId: string) => void>(),
    onDatasetActionsOpen: fn<(datasetId: string) => void>(),
    onDeleteRequested: fn<() => void>(),
    onExportRequested: fn<() => void>(),
    onUploadRequested: fn<() => void>(),
    onMobileControlChange: fn<(control: string, value: string | boolean | null) => void>(),
    onClassChange: fn<(action: 'add' | 'remove', classId: string) => void>(),
    onMemberRemove: fn<(memberId: string) => void>(),
    onImageAction: fn<(action: string, targetId?: string) => void>(),
    onDatasetAction: fn<(action: string) => void>(),
    onDialogAction: fn<(dialog: string, action: string) => void>(),
  }
}

export function catalogArgTypes(options: readonly CatalogScenarioKey[]) {
  return {
    scenario: {
      control: {
        type: 'select' as const,
        labels: Object.fromEntries(options.map((key) => [key, CATALOG_SCENARIO_LABELS[key]])),
      },
      options: [...options],
      description: 'Choose a documented Dataset Catalog state in this group.',
      table: { category: 'Dataset Catalog state' },
    },
    onDatasetChange: ACTION_ARG_TYPE,
    onDatasetSelectionChange: ACTION_ARG_TYPE,
    onSearchChange: ACTION_ARG_TYPE,
    onFilterAction: ACTION_ARG_TYPE,
    onSortChange: ACTION_ARG_TYPE,
    onViewModeChange: ACTION_ARG_TYPE,
    onImageSelectionChange: ACTION_ARG_TYPE,
    onImageDetailOpen: ACTION_ARG_TYPE,
    onImageActionsOpen: ACTION_ARG_TYPE,
    onDatasetActionsOpen: ACTION_ARG_TYPE,
    onDeleteRequested: ACTION_ARG_TYPE,
    onExportRequested: ACTION_ARG_TYPE,
    onUploadRequested: ACTION_ARG_TYPE,
    onMobileControlChange: ACTION_ARG_TYPE,
    onClassChange: ACTION_ARG_TYPE,
    onMemberRemove: ACTION_ARG_TYPE,
    onImageAction: ACTION_ARG_TYPE,
    onDatasetAction: ACTION_ARG_TYPE,
    onDialogAction: ACTION_ARG_TYPE,
  }
}

export function catalogParameters(description: string) {
  return {
    layout: 'fullscreen' as const,
    ...catalogHandoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...catalogHandoff.docs,
      description: {
        component: `${description}\n\n${catalogHandoff.docs.description.component}`,
      },
    },
  }
}

const CATALOG_MOBILE_QUERY = `(max-width: ${breakpoints.md}px)`

function useNarrowCatalogViewport() {
  const readMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(CATALOG_MOBILE_QUERY).matches
      : false
  const [matches, setMatches] = React.useState(readMatch)

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const query = window.matchMedia(CATALOG_MOBILE_QUERY)
    const update = () => setMatches(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return matches
}

export function DatasetCatalogScene({ scenario: key, ...actions }: CatalogStoryArgs) {
  const scenario = catalogScenarios[key]
  const state = useCatalogScene(scenario)
  const isNarrowViewport = useNarrowCatalogViewport()
  const isMobile = !!scenario.isMobile || isNarrowViewport
  const datasetNameById = React.useMemo(
    () => Object.fromEntries(scenario.datasets.map((dataset) => [dataset.id, dataset.name])),
    [scenario.datasets],
  )
  const props = buildCatalogViewProps(scenario, state, datasetNameById, isMobile)

  return <CatalogView {...instrumentCatalogViewProps(props, actions)} />
}

function instrumentCatalogViewProps(
  props: CatalogViewProps,
  actions: CatalogStoryActions,
): CatalogViewProps {
  const datasets = {
    ...props.datasets,
    onSelectAll: report(actions.onDatasetSelectionChange, props.datasets.onSelectAll, '*'),
    onToggleSelect: report(actions.onDatasetSelectionChange, props.datasets.onToggleSelect),
    onSelectCurrent: report(actions.onDatasetChange, props.datasets.onSelectCurrent),
    onAddDataset: reportVoid(actions.onDatasetAction, props.datasets.onAddDataset, 'add'),
    onOpenDatasetMenu: (id: string, anchor: HTMLElement) => {
      actions.onDatasetActionsOpen(id)
      props.datasets.onOpenDatasetMenu(id, anchor)
    },
  }
  const images = {
    ...props.images,
    onToggleSelect: report(actions.onImageSelectionChange, props.images.onToggleSelect),
    onOpenDetail: report(actions.onImageDetailOpen, props.images.onOpenDetail),
    onOpenMenu: (id: string, anchor: HTMLElement) => {
      actions.onImageActionsOpen(id)
      props.images.onOpenMenu(id, anchor)
    },
  }
  const overlays = instrumentOverlays(props.overlays, actions)

  if (props.isMobile) {
    return {
      ...props,
      datasets,
      toolbar: instrumentToolbar(props.toolbar, actions),
      images,
      overlays,
      mobile: {
        ...props.mobile,
        onSetDatasetSelectorOpen: report(
          actions.onMobileControlChange,
          props.mobile.onSetDatasetSelectorOpen,
          'dataset-selector',
        ),
        onSetBottomSheet: report(
          actions.onMobileControlChange,
          props.mobile.onSetBottomSheet,
          'bottom-sheet',
        ),
      },
    }
  }

  return {
    ...props,
    datasets,
    toolbar: instrumentToolbar(props.toolbar, actions),
    images,
    overlays,
    rightSidebar: props.rightSidebar
      ? {
          ...props.rightSidebar,
          onAddClass: report(actions.onClassChange, props.rightSidebar.onAddClass, 'add'),
          onRemoveClass: report(actions.onClassChange, props.rightSidebar.onRemoveClass, 'remove'),
          onRemoveMember: report(actions.onMemberRemove, props.rightSidebar.onRemoveMember),
        }
      : null,
  }
}

function instrumentToolbar<TViewMode extends CatalogViewMode>(
  toolbar: CatalogToolbarPaneProps<TViewMode>,
  actions: CatalogStoryActions,
): CatalogToolbarPaneProps<TViewMode> {
  return {
    ...toolbar,
    onChangeViewMode: (mode) => {
      actions.onViewModeChange(mode)
      toolbar.onChangeViewMode(mode)
    },
    onSearchChange: report(actions.onSearchChange, toolbar.onSearchChange),
    onFilterChange: (...args) => {
      actions.onFilterAction('change')
      toolbar.onFilterChange(...args)
    },
    onFilterReset: reportVoid(actions.onFilterAction, toolbar.onFilterReset, 'reset'),
    onSortChange: report(actions.onSortChange, toolbar.onSortChange),
    onToggleSelectAll: report(actions.onImageSelectionChange, toolbar.onToggleSelectAll, '*'),
    onDelete: reportVoid(actions.onDeleteRequested, toolbar.onDelete),
    onExport: reportVoid(actions.onExportRequested, toolbar.onExport),
    onUpload: reportVoid(actions.onUploadRequested, toolbar.onUpload),
  }
}

function instrumentOverlays(
  overlays: CatalogOverlaysProps,
  actions: CatalogStoryActions,
): CatalogOverlaysProps {
  return {
    ...overlays,
    imageMenu: {
      ...overlays.imageMenu,
      onClose: reportVoid(actions.onImageAction, overlays.imageMenu.onClose, 'close'),
      onCopyTo: optionalReport(actions.onImageAction, overlays.imageMenu.onCopyTo, 'copy-to'),
      onMoveTo: optionalReport(actions.onImageAction, overlays.imageMenu.onMoveTo, 'move-to'),
      onArchive: optionalReportVoid(actions.onImageAction, overlays.imageMenu.onArchive, 'archive'),
      onUnarchive: optionalReportVoid(actions.onImageAction, overlays.imageMenu.onUnarchive, 'unarchive'),
      onDelete: optionalReportVoid(actions.onImageAction, overlays.imageMenu.onDelete, 'delete'),
      onOpenLabeling: optionalReportVoid(actions.onImageAction, overlays.imageMenu.onOpenLabeling, 'open-labeling'),
    },
    datasetMenu: {
      ...overlays.datasetMenu,
      onClose: reportVoid(actions.onDatasetAction, overlays.datasetMenu.onClose, 'close-menu'),
      onRename: reportVoid(actions.onDatasetAction, overlays.datasetMenu.onRename, 'rename'),
      onDuplicate: reportVoid(actions.onDatasetAction, overlays.datasetMenu.onDuplicate, 'duplicate'),
      onExport: reportVoid(actions.onDatasetAction, overlays.datasetMenu.onExport, 'export'),
      onDelete: reportVoid(actions.onDatasetAction, overlays.datasetMenu.onDelete, 'delete'),
    },
    detail: {
      ...overlays.detail,
      onClose: dialogAction(actions, 'image-inspector', 'close', overlays.detail.onClose),
    },
    addDataset: {
      ...overlays.addDataset,
      onClose: dialogAction(actions, 'add-dataset', 'close', overlays.addDataset.onClose),
      onSubmit: dialogAction(actions, 'add-dataset', 'submit', overlays.addDataset.onSubmit),
    },
    duplicateDataset: {
      ...overlays.duplicateDataset,
      onClose: dialogAction(actions, 'duplicate-dataset', 'close', overlays.duplicateDataset.onClose),
      onSubmit: dialogAction(actions, 'duplicate-dataset', 'submit', overlays.duplicateDataset.onSubmit),
    },
    dragDrop: {
      ...overlays.dragDrop,
      onClose: dialogAction(actions, 'drag-drop', 'close', overlays.dragDrop.onClose),
      onConfirm: dialogAction(actions, 'drag-drop', 'confirm', overlays.dragDrop.onConfirm),
    },
    igpExport: {
      ...overlays.igpExport,
      onClose: dialogAction(actions, 'dataset-igp-export', 'close', overlays.igpExport.onClose),
    },
    uploadQuality: {
      ...overlays.uploadQuality,
      onClose: dialogAction(actions, 'upload-quality', 'close', overlays.uploadQuality.onClose),
      onConfirm: dialogAction(actions, 'upload-quality', 'confirm', overlays.uploadQuality.onConfirm),
    },
    pendingClassRemoval: {
      ...overlays.pendingClassRemoval,
      onCancel: dialogAction(actions, 'remove-class', 'cancel', overlays.pendingClassRemoval.onCancel),
      onConfirm: dialogAction(actions, 'remove-class', 'confirm', overlays.pendingClassRemoval.onConfirm),
    },
    pendingMemberRemoval: {
      ...overlays.pendingMemberRemoval,
      onCancel: dialogAction(actions, 'remove-member', 'cancel', overlays.pendingMemberRemoval.onCancel),
      onConfirm: dialogAction(actions, 'remove-member', 'confirm', overlays.pendingMemberRemoval.onConfirm),
    },
    pendingDatasetDeletion: {
      ...overlays.pendingDatasetDeletion,
      onCancel: dialogAction(actions, 'delete-dataset', 'cancel', overlays.pendingDatasetDeletion.onCancel),
      onConfirm: dialogAction(actions, 'delete-dataset', 'confirm', overlays.pendingDatasetDeletion.onConfirm),
    },
    bulkDelete: {
      ...overlays.bulkDelete,
      onClose: dialogAction(actions, 'delete-images', 'close', overlays.bulkDelete.onClose),
      onConfirm: dialogAction(actions, 'delete-images', 'confirm', overlays.bulkDelete.onConfirm),
    },
    exportConfig: {
      ...overlays.exportConfig,
      onRangeChange: dialogValueAction(actions, 'gallery-export', 'range', overlays.exportConfig.onRangeChange),
      onExportTypeChange: dialogValueAction(actions, 'gallery-export', 'type', overlays.exportConfig.onExportTypeChange),
      onImageFormatChange: dialogValueAction(actions, 'gallery-export', 'format', overlays.exportConfig.onImageFormatChange),
      onGroupByChange: dialogValueAction(actions, 'gallery-export', 'group-by', overlays.exportConfig.onGroupByChange),
      onGroupKeyRegexChange: dialogValueAction(actions, 'gallery-export', 'regex', overlays.exportConfig.onGroupKeyRegexChange),
      onClose: dialogAction(actions, 'gallery-export', 'close', overlays.exportConfig.onClose),
      onStart: dialogAction(actions, 'gallery-export', 'start', overlays.exportConfig.onStart),
    },
    exportProgress: {
      ...overlays.exportProgress,
      onClose: dialogAction(actions, 'gallery-export-progress', 'close', overlays.exportProgress.onClose),
      onDownloadAgain: dialogAction(actions, 'gallery-export-progress', 'download-again', overlays.exportProgress.onDownloadAgain),
    },
    datasetTransfer: {
      ...overlays.datasetTransfer,
      onActionChange: dialogValueAction(actions, 'transfer-images', 'action', overlays.datasetTransfer.onActionChange),
      onSourceChange: dialogValueAction(actions, 'transfer-images', 'source', overlays.datasetTransfer.onSourceChange),
      onTargetChange: dialogValueAction(actions, 'transfer-images', 'target', overlays.datasetTransfer.onTargetChange),
      onCopy: dialogAction(actions, 'transfer-images', 'copy', overlays.datasetTransfer.onCopy),
      onMove: dialogAction(actions, 'transfer-images', 'move', overlays.datasetTransfer.onMove),
    },
  }
}

function report<T extends unknown[], Prefix extends unknown[]>(
  action: (...args: [...Prefix, ...T]) => void,
  callback: (...args: T) => void,
  ...prefix: Prefix
) {
  return (...args: T) => {
    action(...prefix, ...args)
    callback(...args)
  }
}

function optionalReport<T extends unknown[], Prefix extends unknown[]>(
  action: (...args: [...Prefix, ...T]) => void,
  callback: ((...args: T) => void) | undefined,
  ...prefix: Prefix
) {
  return callback ? report(action, callback, ...prefix) : undefined
}

function reportVoid<Prefix extends unknown[]>(
  action: (...args: Prefix) => void,
  callback: () => void,
  ...prefix: Prefix
) {
  return () => {
    action(...prefix)
    callback()
  }
}

function optionalReportVoid<Prefix extends unknown[]>(
  action: (...args: Prefix) => void,
  callback: (() => void) | undefined,
  ...prefix: Prefix
) {
  return callback ? reportVoid(action, callback, ...prefix) : undefined
}

function dialogAction<T extends unknown[]>(
  actions: CatalogStoryActions,
  dialog: string,
  action: string,
  callback: (...args: T) => void,
) {
  return (...args: T) => {
    actions.onDialogAction(dialog, action)
    callback(...args)
  }
}

function dialogValueAction<T>(
  actions: CatalogStoryActions,
  dialog: string,
  field: string,
  callback: (value: T) => void,
) {
  return (value: T) => {
    actions.onDialogAction(dialog, `${field}:${String(value)}`)
    callback(value)
  }
}
