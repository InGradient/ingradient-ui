import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogView } from '@ingradient/platform-pages'
import { catalogScenarios, type CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { buildCatalogViewProps } from './catalog/build-view-props'
import { useCatalogScene } from './catalog/use-catalog-scene'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Catalog',
  referenceStory: 'Pages / Platform / 0.0.1 / Catalog / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/catalog-{datasets,images,scenarios}.ts',
  requiredScenarios: [
    'default', 'empty-images', 'loading-images', 'permission-denied',
    'mixed-sync', 'archived', 'multi-selection', 'table-view', 'stats-view',
  ],
  interactions: [
    'dataset 클릭 → current dataset 변경 + image list 갱신',
    'image 카드 클릭 → detail modal',
    'view mode toggle → Grid / Table / Stats 전환',
    'kebab 클릭 → image / dataset 메뉴',
  ],
  platformIntegration: [
    'CatalogView 를 그대로 import — props 에 hook 결과 연결',
    'datasets → useCatalogDatasets()',
    'images → useGalleryImageList()',
    'selectedDatasetIds / currentDatasetId → useCatalogPageUiState()',
    'image menu actions → useGalleryImageMenu / mutations',
  ],
})

type Args = { scenario: CatalogScenarioKey }

function CatalogScene({ scenario: key }: Args) {
  const scenario = catalogScenarios[key]
  const s = useCatalogScene(scenario)
  const datasetNameById = React.useMemo(
    () => Object.fromEntries(scenario.datasets.map((d) => [d.id, d.name])),
    [scenario.datasets],
  )
  return <CatalogView {...buildCatalogViewProps(scenario, s, datasetNameById)} />
}

const SCENARIO_KEYS = Object.keys(catalogScenarios) as CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Catalog',
  component: CatalogScene,
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: { scenario: { control: 'select', options: SCENARIO_KEYS, table: { category: 'Page' } } },
  args: { scenario: 'default' as CatalogScenarioKey },
} satisfies Meta<typeof CatalogScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const EmptyDatasets: Story = { args: { scenario: 'empty-datasets' } }
export const EmptyImages: Story = { args: { scenario: 'empty-images' } }
export const LoadingDatasets: Story = { args: { scenario: 'loading-datasets' } }
export const LoadingImages: Story = { args: { scenario: 'loading-images' } }
export const Error: Story = { args: { scenario: 'error' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const NoProject: Story = { args: { scenario: 'no-project' } }
export const ManyImages: Story = { args: { scenario: 'many-images' } }
export const LongText: Story = { args: { scenario: 'long-text' } }
export const MultiSelection: Story = { args: { scenario: 'multi-selection' } }
export const MixedSync: Story = { args: { scenario: 'mixed-sync' } }
export const Archived: Story = { args: { scenario: 'archived' } }
export const Processing: Story = { args: { scenario: 'processing' } }
export const GroupMode: Story = { args: { scenario: 'group-mode' } }
export const HoverPreviewState: Story = { args: { scenario: 'hover-preview' } }
export const DetailOpen: Story = { args: { scenario: 'detail-open' } }
export const FilterOpen: Story = { args: { scenario: 'filter-open' } }
export const SortOpen: Story = { args: { scenario: 'sort-open' } }
export const ImageMenuOpen: Story = { args: { scenario: 'image-menu-open' } }
export const DatasetMenuOpen: Story = { args: { scenario: 'dataset-menu-open' } }
export const DragOverSidebar: Story = { args: { scenario: 'drag-over-sidebar' } }
export const DragOverGrid: Story = { args: { scenario: 'drag-over-grid' } }
export const UploadPending: Story = { args: { scenario: 'upload-pending' } }
export const SidebarCollapsed: Story = { args: { scenario: 'sidebar-collapsed' } }
export const TableView: Story = { args: { scenario: 'table-view' } }
export const StatsView: Story = { args: { scenario: 'stats-view' } }
export const RightEmptyClasses: Story = { args: { scenario: 'right-empty-classes' } }
export const RightLoading: Story = { args: { scenario: 'right-loading' } }
export const RightManyClasses: Story = { args: { scenario: 'right-many-classes' } }
export const MemberOverflow: Story = { args: { scenario: 'member-overflow' } }
export const FilterActive: Story = { args: { scenario: 'filter-active' } }
export const StatsRich: Story = { args: { scenario: 'stats-rich' } }
export const StatsEmpty: Story = { args: { scenario: 'stats-empty' } }
export const ModalAddDataset: Story = { args: { scenario: 'modal-add-dataset' } }
export const ModalDuplicate: Story = { args: { scenario: 'modal-duplicate' } }
export const ModalDragDrop: Story = { args: { scenario: 'modal-drag-drop' } }
export const ModalIgpExportProgress: Story = { args: { scenario: 'modal-igp-export-progress' } }
export const ModalIgpExportReady: Story = { args: { scenario: 'modal-igp-export-ready' } }
export const ModalUploadQuality: Story = { args: { scenario: 'modal-upload-quality' } }
export const ModalConfirmClassRemoval: Story = { args: { scenario: 'modal-confirm-class-removal' } }
export const ModalConfirmDatasetDeletion: Story = { args: { scenario: 'modal-confirm-dataset-deletion' } }
export const ModalBulkDelete: Story = { args: { scenario: 'modal-bulk-delete' } }
export const ModalExportConfig: Story = { args: { scenario: 'modal-export-config' } }
export const ModalExportProgress: Story = { args: { scenario: 'modal-export-progress' } }
export const ModalExportComplete: Story = { args: { scenario: 'modal-export-complete' } }
export const ModalTransferCopy: Story = { args: { scenario: 'modal-transfer-copy' } }
export const ModalTransferMove: Story = { args: { scenario: 'modal-transfer-move' } }
export const UploadInProgress: Story = { args: { scenario: 'upload-in-progress' } }
export const DragOverFull: Story = { args: { scenario: 'drag-over-full' } }
export const DetailWithAnnotations: Story = { args: { scenario: 'detail-with-annotations' } }
export const DetailWithComments: Story = { args: { scenario: 'detail-with-comments' } }
export const DetailMultiClass: Story = { args: { scenario: 'detail-multi-class' } }
export const ImageMenuSubmenu: Story = { args: { scenario: 'image-menu-submenu' } }
export const ImageMenuArchived: Story = { args: { scenario: 'image-menu-archived' } }
export const ImageMenuClipboardReady: Story = { args: { scenario: 'image-menu-clipboard-ready' } }
export const MobileDefault: Story = { args: { scenario: 'mobile-default' } }
export const MobileDatasetDropdownOpen: Story = { args: { scenario: 'mobile-dataset-dropdown-open' } }
export const MobileBottomFilter: Story = { args: { scenario: 'mobile-bottom-filter' } }
