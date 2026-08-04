import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { playActiveFilters, playWorkspaceOverview } from './catalog/catalog-story-plays'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'default',
  'filter-active',
  'filter-open',
  'sort-open',
  'dataset-menu-open',
  'image-menu-open',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Interactions',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Executable filter, sort, and contextual-action states for the Dataset Catalog workspace.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const ToolbarWorkflow: Story = {
  name: 'Toolbar workflow',
  play: playWorkspaceOverview,
}
export const ActiveFilteredResults: Story = {
  name: 'Active filtered results',
  args: { scenario: 'filter-active' },
  play: playActiveFilters,
}
export const FilterPanelOpen: Story = { name: 'Filter panel open', args: { scenario: 'filter-open' } }
export const SortMenuOpen: Story = { name: 'Sort menu open', args: { scenario: 'sort-open' } }
export const DatasetActionsMenu: Story = {
  name: 'Dataset actions menu',
  args: { scenario: 'dataset-menu-open' },
}
export const ImageActionsMenu: Story = { name: 'Image actions menu', args: { scenario: 'image-menu-open' } }
