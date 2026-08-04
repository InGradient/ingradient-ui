import React from 'react'
import { fn } from 'storybook/test'
import {
  ClassManageView,
  type ClassImage,
  type ClassManageViewProps,
} from '@ingradient/platform-pages'
import {
  classScenarios,
  type ClassScenarioKey,
} from '../../../../fixtures/platform/0.0.1/class-scenarios'
import { classIdToColorMap } from '../../../../fixtures/platform/0.0.1/class-classes'
import { classIdToDatasets } from '../../../../fixtures/platform/0.0.1/class-datasets'
import { imagesForCl1 } from '../../../../fixtures/platform/0.0.1/class-images'
import { COCO_CLASS_NAMES } from '../../../../fixtures/platform/0.0.1/coco-class-names'
import { defineHandoff } from '../../../../support/handoff'
import { useClassManageScene } from './use-class-manage-scene'

export interface ClassManageStoryActions {
  onClassSelectionChange: (classId: string | null) => void
  onSidebarChange: (collapsed: boolean) => void
  onDatasetSelectionChange: (datasetId: string, active: boolean) => void
  onClassFieldChange: (field: string, value: string | null) => void
  onClassAction: (action: string, classId?: string) => void
  onImageAction: (action: string, imageId?: string) => void
  onReferenceImageAction: (action: string, imageId?: string, bboxIndex?: number) => void
  onMappingChange: (value: string) => void
  onDialogAction: (dialog: string, action: string) => void
}

export interface ClassManageStoryArgs extends ClassManageStoryActions {
  scenario: ClassScenarioKey
}

export const CLASS_SCENARIO_LABELS: Record<ClassScenarioKey, string> = {
  default: 'Populated class workspace',
  'sidebar-collapsed': 'Class sidebar collapsed',
  'large-image-set': 'Large image set',
  'class-list-overflow': 'Long and dense class list',
  'no-class-selected': 'No class selected',
  'no-classes': 'No classes',
  'classes-loading': 'Classes loading',
  error: 'Class load error',
  'permission-denied': 'Access denied',
  'no-project': 'No project selected',
  'no-linked-datasets': 'No linked datasets',
  'linked-datasets-loading': 'Linked datasets loading',
  'images-loading': 'Images loading',
  'no-images': 'No images',
  'drag-over-reference': 'Reference drop target active',
  'reference-image-pending': 'Reference image update pending',
  'reference-image-error': 'Reference image update error',
  'bbox-nav-multi': 'Multiple reference bounding boxes',
  'pattern-sequence': 'Pattern sequence inspector',
  'add-class-dialog': 'Add class dialog open',
  'mapping-enabled': 'COCO mapping enabled',
}

const classManageHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Class Management',
  referenceStory: 'Pages / Platform / 0.0.1 / Class Management / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath:
    'stories/fixtures/platform/0.0.1/class-{classes,datasets,images,scenarios}.ts + coco-class-names.ts',
  requiredScenarios: [
    'default',
    'sidebar-collapsed',
    'no-class-selected',
    'no-classes',
    'classes-loading',
    'permission-denied',
    'no-linked-datasets',
    'images-loading',
    'drag-over-reference',
    'reference-image-error',
    'pattern-sequence',
    'mapping-enabled',
  ],
  interactions: [
    'class 선택 → linked datasets / images / details 갱신',
    'class sidebar 접기/펼치기 → workspace reflow',
    'dataset chip 선택 → visible image set 갱신',
    'image 클릭/우클릭 → lightbox / reference action',
    'reference bbox 탐색 → selected crop callback',
    '+ Add class → 실제 class 생성',
    'class kebab → Duplicate / Delete workflow',
    'COCO mapping 선택 → controlled mapping 갱신',
  ],
  platformIntegration: [
    'ClassManageView 를 그대로 import — story runtime 이 controlled props 를 구성',
    'classes → useClasses() / class store',
    'datasets / images → selected class 기반 query 결과',
    'permissions → project class-management permission',
  ],
})

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

export function createClassManageActionArgs(): ClassManageStoryActions {
  return {
    onClassSelectionChange: fn<(classId: string | null) => void>(),
    onSidebarChange: fn<(collapsed: boolean) => void>(),
    onDatasetSelectionChange: fn<(datasetId: string, active: boolean) => void>(),
    onClassFieldChange: fn<(field: string, value: string | null) => void>(),
    onClassAction: fn<(action: string, classId?: string) => void>(),
    onImageAction: fn<(action: string, imageId?: string) => void>(),
    onReferenceImageAction: fn<(
      action: string,
      imageId?: string,
      bboxIndex?: number,
    ) => void>(),
    onMappingChange: fn<(value: string) => void>(),
    onDialogAction: fn<(dialog: string, action: string) => void>(),
  }
}

export function classManageArgTypes(options: readonly ClassScenarioKey[]) {
  return {
    scenario: {
      control: {
        type: 'select' as const,
        labels: Object.fromEntries(options.map((key) => [key, CLASS_SCENARIO_LABELS[key]])),
      },
      options: [...options],
      description: 'Choose a documented Class Management state in this group.',
      table: { category: 'Class Management state' },
    },
    onClassSelectionChange: ACTION_ARG_TYPE,
    onSidebarChange: ACTION_ARG_TYPE,
    onDatasetSelectionChange: ACTION_ARG_TYPE,
    onClassFieldChange: ACTION_ARG_TYPE,
    onClassAction: ACTION_ARG_TYPE,
    onImageAction: ACTION_ARG_TYPE,
    onReferenceImageAction: ACTION_ARG_TYPE,
    onMappingChange: ACTION_ARG_TYPE,
    onDialogAction: ACTION_ARG_TYPE,
  }
}

export function classManageParameters(description: string) {
  return {
    layout: 'fullscreen' as const,
    ...classManageHandoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...classManageHandoff.docs,
      description: {
        component: `${description}\n\n${classManageHandoff.docs.description.component}`,
      },
    },
  }
}

export function ClassManagementScene({ scenario: key, ...actions }: ClassManageStoryArgs) {
  const scenario = classScenarios[key]
  const state = useClassManageScene(scenario)
  const selectedClass = state.classes.find((entry) => entry.id === state.selectedClassId) ?? null
  const selectedDataClassId = normalizeDataClassId(state.selectedClassId)
  const usesScenarioData = state.selectedClassId === scenario.selectedClassId
  const datasets = !state.selectedClassId
    ? []
    : usesScenarioData
      ? scenario.datasets
      : classIdToDatasets[selectedDataClassId ?? ''] ?? []
  const sourceImages = !state.selectedClassId
    ? []
    : usesScenarioData
      ? scenario.images
      : selectedDataClassId === 'cl-1'
        ? imagesForCl1
        : []
  const images = state.activeDatasetIds.size === 0
    ? sourceImages
    : sourceImages.filter(
        (image) => !!image.dataset_id && state.activeDatasetIds.has(image.dataset_id),
      )
  const classIdToColor = classIdToColorMap(state.classes)

  const applyReferenceImage = (
    action: string,
    imageId: string,
    bboxIndex?: number,
  ) => {
    actions.onReferenceImageAction(action, imageId, bboxIndex)
    if (!selectedClass) return
    const image = findImage(imageId, sourceImages, scenario.images)
    state.updateClass(selectedClass.id, {
      reference_image_url: image?.thumb_url ?? selectedClass.reference_image_url,
    })
  }

  const props: ClassManageViewProps = {
    projectName: 'Wafer-2026',
    permissionDenied: scenario.permissionDenied,
    error: scenario.error ?? null,
    noProject: scenario.noProject,
    list: {
      classes: state.classes,
      selectedClassId: state.selectedClassId,
      loading: scenario.classesLoading,
      sidebarCollapsed: state.sidebarCollapsed,
      openMenuId: state.classMenuOpen?.id,
      onSelectClass: (id) => {
        actions.onClassSelectionChange(id)
        state.setSelectedClassId(id)
      },
      onAddClass: () => {
        actions.onClassAction('add-request')
        actions.onDialogAction('add-class', 'open')
        state.setAddClassOpen(true)
      },
      onCollapse: () => {
        actions.onSidebarChange(true)
        state.setSidebarCollapsed(true)
      },
      onExpand: () => {
        actions.onSidebarChange(false)
        state.setSidebarCollapsed(false)
      },
      onOpenClassMenu: (id, anchor) => {
        actions.onClassAction('open-menu', id)
        state.setSelectedClassId(id)
        state.setClassMenuOpen({ id, anchor })
      },
    },
    images: {
      selectedClassId: state.selectedClassId,
      datasets,
      activeDatasetIds: state.activeDatasetIds,
      detailLoading: scenario.detailLoading,
      imagesLoading: scenario.imagesLoading,
      images,
      classIdToColor,
      onToggleDataset: (id) => {
        const active = state.activeDatasetIds.size === 0 || state.activeDatasetIds.has(id)
        actions.onDatasetSelectionChange(id, !active)
        state.toggleDataset(id)
      },
      onOpenImage: (image) => {
        actions.onImageAction('open', image.id)
        state.setLightboxImage(image)
      },
      onOpenContextMenu: (image, position) => {
        actions.onImageAction('open-context-menu', image.id)
        state.setContextMenu({ imageId: image.id, ...position })
      },
    },
    info: selectedClass
      ? {
          selectedClass,
          isReferenceDragOver: state.isReferenceDragOver,
          referencePending: scenario.referencePending,
          referenceError: scenario.referenceError ?? null,
          referenceBboxCandidates: scenario.referenceBboxCandidates,
          showCocoMapping: scenario.showCocoMapping,
          cocoMappingOptions: COCO_CLASS_NAMES,
          currentMapping: state.currentMapping,
          onChangeClass: (patch) => {
            Object.entries(patch).forEach(([field, value]) => {
              actions.onClassFieldChange(field, value == null ? null : String(value))
            })
            state.updateClass(selectedClass.id, patch)
          },
          onRandomizeColor: () => {
            actions.onClassFieldChange('color', 'randomize')
            state.randomizeColor()
          },
          onSetReferenceDragOver: (dragging) => {
            actions.onReferenceImageAction(dragging ? 'drag-enter' : 'drag-leave')
            state.setReferenceDragOver(dragging)
          },
          onApplyReferenceImage: (imageId, bboxIndex) =>
            applyReferenceImage(bboxIndex == null ? 'apply' : 'select-bbox', imageId, bboxIndex),
          onChangeMapping: (value) => {
            actions.onMappingChange(value)
            state.setCurrentMapping(value)
          },
        }
      : null,
    overlays: {
      addClass: {
        open: state.isAddClassOpen,
        name: state.addClassName,
        onNameChange: (name) => {
          actions.onClassFieldChange('new-class-name', name)
          state.setAddClassName(name)
        },
        onClose: () => {
          actions.onDialogAction('add-class', 'close')
          state.setAddClassOpen(false)
        },
        onConfirm: () => {
          const id = state.addClass(state.addClassName)
          if (id) actions.onClassAction('add', id)
          actions.onDialogAction('add-class', 'confirm')
          state.setAddClassOpen(false)
        },
      },
      classMenu: {
        anchorEl: state.classMenuOpen?.anchor ?? null,
        onClose: () => state.setClassMenuOpen(null),
        onDuplicate: () => {
          actions.onClassAction('duplicate', state.selectedClassId ?? undefined)
          state.duplicateSelectedClass()
          state.setClassMenuOpen(null)
        },
        onDelete: () => {
          actions.onClassAction('delete-request', state.selectedClassId ?? undefined)
          actions.onDialogAction('delete-class', 'open')
          state.setClassMenuOpen(null)
          state.setDeleteConfirmOpen(true)
        },
      },
      contextMenu: {
        position: state.contextMenuOpen
          ? { top: state.contextMenuOpen.top, left: state.contextMenuOpen.left }
          : null,
        onClose: () => {
          actions.onImageAction('close-context-menu', state.contextMenuOpen?.imageId)
          state.setContextMenu(null)
        },
        onAction: (action) => {
          const imageId = state.contextMenuOpen?.imageId
          if (action === 'add-ref' && imageId) {
            applyReferenceImage('assign-from-context-menu', imageId)
          }
        },
      },
      lightbox: {
        image: state.lightboxImage,
        siblings: scenario.lightboxSiblings ?? [],
        selectedClassId: state.selectedClassId,
        classIdToColor,
        onClose: () => {
          actions.onImageAction('close', state.lightboxImage?.id)
          state.setLightboxImage(null)
        },
      },
      deleteConfirm: {
        open: state.deleteConfirmOpen,
        selectedClass,
        onConfirm: () => {
          actions.onClassAction('delete', state.selectedClassId ?? undefined)
          actions.onDialogAction('delete-class', 'confirm')
          state.removeSelectedClass()
          state.setDeleteConfirmOpen(false)
        },
        onCancel: () => {
          actions.onDialogAction('delete-class', 'cancel')
          state.setDeleteConfirmOpen(false)
        },
      },
    },
  }

  return <ClassManageView {...props} />
}

function normalizeDataClassId(classId: string | null) {
  if (!classId) return null
  return classId.endsWith('-copy') ? classId.slice(0, -'-copy'.length) : classId
}

function findImage(
  imageId: string,
  primary: readonly ClassImage[],
  fallback: readonly ClassImage[],
) {
  return primary.find((image) => image.id === imageId)
    ?? fallback.find((image) => image.id === imageId)
    ?? imagesForCl1.find((image) => image.id === imageId)
}
