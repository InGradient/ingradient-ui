import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassManageView } from '@ingradient/platform-pages'
import { classScenarios, type ClassScenarioKey } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { classIdToColorMap } from '../../../fixtures/platform/0.0.1/class-classes'
import { COCO_CLASS_NAMES } from '../../../fixtures/platform/0.0.1/coco-class-names'
import { useClassManageScene } from './class/use-class-manage-scene'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'ClassManage',
  referenceStory: 'Pages / Platform / 0.0.1 / ClassManage / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/class-{classes,datasets,images,scenarios}.ts',
  requiredScenarios: [
    'default', 'empty', 'loading', 'permission-denied',
    'class-with-images', 'no-class-selected', 'long-text', 'many-items',
  ],
  interactions: [
    'class row 클릭 → selectedClassId 변경 + 가운데/우측 reflow',
    'dataset chip 클릭 → 토글',
    'image 클릭 → lightbox open',
    'image right-click → context menu',
    'image drag-drop → reference image set',
    '+Add class → modal open',
    'Delete class → confirm dialog',
  ],
  platformIntegration: [
    'ClassManageView 를 그대로 import — props 에 hook 결과 연결',
    'classes → useClasses() (frontend/store/useClassStore.ts)',
    'classDetail / classImages → useClassPageData() (frontend/features/classes/)',
    'permission denied → useAuth().permissions.canEditClasses',
  ],
})

type Args = { scenario: ClassScenarioKey }

function ClassManageScene({ scenario: key }: Args) {
  const scenario = classScenarios[key]
  const s = useClassManageScene(scenario)
  const classIdToColor = classIdToColorMap(s.classes)
  const selectedClass = s.classes.find((c) => c.id === s.selectedClassId) ?? null

  return (
    <ClassManageView
      projectName="Wafer-2026"
      permissionDenied={scenario.permissionDenied}
      error={scenario.error ?? null}
      noProject={scenario.noProject}
      list={{
        classes: s.classes,
        selectedClassId: s.selectedClassId,
        loading: scenario.classesLoading,
        sidebarCollapsed: s.sidebarCollapsed,
        openMenuId: s.classMenu?.classId,
        onSelectClass: s.setSelectedClassId,
        onAddClass: () => s.setAddClassOpen(true),
        onCollapse: s.collapseSidebar,
        onExpand: s.expandSidebar,
        onOpenClassMenu: s.openClassMenu,
      }}
      images={{
        selectedClassId: s.selectedClassId,
        datasets: scenario.datasets,
        activeDatasetIds: s.activeDatasetIds,
        detailLoading: scenario.detailLoading,
        imagesLoading: scenario.imagesLoading,
        images: scenario.images,
        classIdToColor,
        onToggleDataset: s.toggleDataset,
        onOpenImage: s.setLightboxImage,
        onOpenContextMenu: (img, pos) =>
          s.setContextMenu({ imageId: img.id, top: pos.top, left: pos.left }),
      }}
      info={
        selectedClass
          ? {
              selectedClass,
              isReferenceDragOver: s.isReferenceDragOver,
              referencePending: scenario.referencePending,
              referenceError: scenario.referenceError ?? null,
              referenceBboxCandidates: scenario.referenceBboxCandidates,
              showCocoMapping: scenario.showCocoMapping,
              cocoMappingOptions: COCO_CLASS_NAMES,
              currentMapping: s.currentMapping,
              onChangeClass: (patch) => s.updateClass(selectedClass.id, patch),
              onRandomizeColor: s.randomizeColor,
              onSetReferenceDragOver: s.setReferenceDragOver,
              onApplyReferenceImage: (imageId) =>
                s.updateClass(selectedClass.id, {
                  reference_image_url:
                    scenario.images.find((i) => i.id === imageId)?.thumb_url ??
                    selectedClass.reference_image_url,
                }),
              onChangeMapping: s.setCurrentMapping,
            }
          : null
      }
      overlays={{
        addClass: {
          open: s.isAddClassOpen,
          name: s.addClassName,
          onNameChange: s.setAddClassName,
          onClose: () => s.setAddClassOpen(false),
          onConfirm: () => s.setAddClassOpen(false),
        },
        classMenu: s.classMenu
          ? {
              anchorEl: s.classMenu.anchorEl,
              onClose: s.closeClassMenu,
              onDuplicate: s.duplicateMenuClass,
              onDelete: () => {
                s.closeClassMenu()
                s.setDeleteConfirmOpen(true)
              },
            }
          : undefined,
        contextMenu: {
          position: s.contextMenuOpen
            ? { top: s.contextMenuOpen.top, left: s.contextMenuOpen.left }
            : null,
          onClose: () => s.setContextMenu(null),
        },
        lightbox: {
          image: s.lightboxImage,
          selectedClassId: s.selectedClassId,
          classIdToColor,
          onClose: () => s.setLightboxImage(null),
        },
        deleteConfirm: {
          open: s.deleteConfirmOpen,
          selectedClass,
          onConfirm: () => {
            s.removeSelectedClass()
            s.setDeleteConfirmOpen(false)
          },
          onCancel: () => s.setDeleteConfirmOpen(false),
        },
      }}
    />
  )
}

const SCENARIO_KEYS = Object.keys(classScenarios) as ClassScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/ClassManage',
  component: ClassManageScene,
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: {
    scenario: { control: 'select', options: SCENARIO_KEYS, table: { category: 'Page' } },
  },
  args: { scenario: 'default' as ClassScenarioKey },
} satisfies Meta<typeof ClassManageScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NoClassSelected: Story = { args: { scenario: 'no-class-selected' } }
export const ClassWithImages: Story = { args: { scenario: 'class-with-images' } }
export const ClassWithGroupedImages: Story = { args: { scenario: 'class-with-grouped-images' } }
export const Empty: Story = { args: { scenario: 'empty' } }
export const Loading: Story = { args: { scenario: 'loading' } }
export const Error: Story = { args: { scenario: 'error' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const NoProject: Story = { args: { scenario: 'no-project' } }
export const LongText: Story = { args: { scenario: 'long-text' } }
export const ManyItems: Story = { args: { scenario: 'many-items' } }
export const NoLinkedDatasets: Story = { args: { scenario: 'no-linked-datasets' } }
export const ImagesLoading: Story = { args: { scenario: 'images-loading' } }
export const ImagesEmpty: Story = { args: { scenario: 'images-empty' } }
export const DragOverReference: Story = { args: { scenario: 'drag-over-reference' } }
export const ReferenceImageSet: Story = { args: { scenario: 'reference-image-set' } }
export const ReferenceImagePending: Story = { args: { scenario: 'reference-image-pending' } }
export const BboxNavMulti: Story = { args: { scenario: 'bbox-nav-multi' } }
export const LightboxOpen: Story = { args: { scenario: 'lightbox-open' } }
export const LightboxWithPatternTabs: Story = { args: { scenario: 'lightbox-with-pattern-tabs' } }
export const ContextMenuOpen: Story = { args: { scenario: 'context-menu-open' } }
export const AddClassModalOpen: Story = { args: { scenario: 'add-class-modal-open' } }
export const DeleteConfirmOpen: Story = { args: { scenario: 'delete-confirm-open' } }
export const MappingCocoActive: Story = { args: { scenario: 'mapping-coco-active' } }
export const MappingDisabled: Story = { args: { scenario: 'mapping-disabled' } }
export const SidebarCollapsed: Story = { args: { scenario: 'sidebar-collapsed' } }
export const ClassMenuOpen: Story = { args: { scenario: 'class-menu-open' } }
