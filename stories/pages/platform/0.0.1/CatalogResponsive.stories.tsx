import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { playMobileSort, playMobileStatsFallback } from './catalog/catalog-story-plays'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'mobile-default',
  'mobile-dataset-dropdown-open',
  'mobile-bottom-filter',
  'mobile-bottom-sort',
  'stats-view',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Responsive',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: {
    ...catalogParameters(
      'Mobile Dataset Catalog shell, selector, bottom sheets, and the desktop-only analytics fallback contract.',
    ),
    viewport: { defaultViewport: 'mobile' },
  },
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'mobile-default', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
export const DatasetSelectorOpen: Story = {
  name: 'Dataset selector open',
  args: { scenario: 'mobile-dataset-dropdown-open' },
}
export const FilterSheetOpen: Story = {
  name: 'Filter sheet open',
  args: { scenario: 'mobile-bottom-filter' },
}
export const SortSheetOpen: Story = {
  name: 'Sort sheet open',
  args: { scenario: 'mobile-bottom-sort' },
  play: playMobileSort,
}
export const AnalyticsFallback: Story = {
  name: 'Analytics falls back to image grid',
  args: { scenario: 'stats-view' },
  play: playMobileStatsFallback,
}
