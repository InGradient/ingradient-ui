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

type Args = { scenario: CatalogScenarioKey; sidebarCollapsed: boolean }

function CatalogScene({ scenario: key, sidebarCollapsed }: Args) {
  const baseScenario = catalogScenarios[key]
  const scenario = React.useMemo(
    () => (sidebarCollapsed ? { ...baseScenario, sidebarCollapsed: true } : baseScenario),
    [baseScenario, sidebarCollapsed],
  )
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
  argTypes: {
    scenario: { control: 'select', options: SCENARIO_KEYS, table: { category: 'Page' } },
    sidebarCollapsed: { control: 'boolean', table: { category: 'Layout' } },
  },
  args: { scenario: 'default' as CatalogScenarioKey, sidebarCollapsed: false },
} satisfies Meta<typeof CatalogScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** 5 state 변형 (Empty / Loading / Error / PermissionDenied / NoProject) — Controls 의 scenario 로 전환. */
export const StateShowcase: Story = { args: { scenario: 'empty' } }
/** 5 data 변형 (StressTest / Archived / Processing / GroupMode / HoverPreview) — Controls 의 scenario 로 전환. */
export const DataVariantsShowcase: Story = { args: { scenario: 'stress-test' } }
export const MultiSelection: Story = { args: { scenario: 'multi-selection' } }
export const DetailOpen: Story = { args: { scenario: 'detail-open' } }
/** Filter/Sort 팝오버 + Image/Dataset 메뉴 — Controls 의 scenario 로 전환. */
export const InteractionShowcase: Story = { args: { scenario: 'filter-open' } }
export const DragOver: Story = { args: { scenario: 'drag-over' } }
export const Uploading: Story = { args: { scenario: 'uploading' } }
/** 2 view mode (Table / Stats) — Controls 의 scenario 로 전환. */
export const ViewModeShowcase: Story = { args: { scenario: 'table-view' } }
/** 2 right panel state (Loading / ManyClasses) — Controls 의 scenario 로 전환. */
export const RightPanelShowcase: Story = { args: { scenario: 'right-loading' } }
/** 9 modal 변형 (AddDataset / Duplicate / DragDrop / IgpExport / UploadQuality / ConfirmDelete / BulkDelete / Export / Transfer) — Controls 의 scenario 로 전환. */
export const ModalShowcase: Story = { args: { scenario: 'modal-add-dataset' } }
export const DetailRich: Story = { args: { scenario: 'detail-rich' } }
/** 2 mobile 변형 (Default / BottomFilter) — Controls 의 scenario 로 전환. */
export const MobileShowcase: Story = { args: { scenario: 'mobile-default' } }
