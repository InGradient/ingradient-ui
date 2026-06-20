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
    'default', 'empty', 'loading', 'permission-denied',
    'archived', 'multi-selection', 'table-view', 'stats-view',
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
export const Empty: Story = { args: { scenario: 'empty' } }
export const Loading: Story = { args: { scenario: 'loading' } }
export const Error: Story = { args: { scenario: 'error' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const NoProject: Story = { args: { scenario: 'no-project' } }
export const StressTest: Story = { args: { scenario: 'stress-test' } }
export const MultiSelection: Story = { args: { scenario: 'multi-selection' } }
export const Archived: Story = { args: { scenario: 'archived' } }
export const Processing: Story = { args: { scenario: 'processing' } }
export const GroupMode: Story = { args: { scenario: 'group-mode' } }
export const HoverPreviewState: Story = { args: { scenario: 'hover-preview' } }
export const DetailOpen: Story = { args: { scenario: 'detail-open' } }
/** Filter/Sort 팝오버 + Image/Dataset 메뉴 — Controls 의 scenario 로 전환. */
export const InteractionShowcase: Story = { args: { scenario: 'filter-open' } }
export const DragOver: Story = { args: { scenario: 'drag-over' } }
export const Uploading: Story = { args: { scenario: 'uploading' } }
export const SidebarCollapsed: Story = { args: { scenario: 'sidebar-collapsed' } }
export const TableView: Story = { args: { scenario: 'table-view' } }
export const StatsView: Story = { args: { scenario: 'stats-view' } }
export const RightLoading: Story = { args: { scenario: 'right-loading' } }
export const RightManyClasses: Story = { args: { scenario: 'right-many-classes' } }
/** 9 modal 변형 (AddDataset / Duplicate / DragDrop / IgpExport / UploadQuality / ConfirmDelete / BulkDelete / Export / Transfer) — Controls 의 scenario 로 전환. */
export const ModalShowcase: Story = { args: { scenario: 'modal-add-dataset' } }
export const DetailRich: Story = { args: { scenario: 'detail-rich' } }
export const MobileDefault: Story = { args: { scenario: 'mobile-default' } }
export const MobileBottomFilter: Story = { args: { scenario: 'mobile-bottom-filter' } }
