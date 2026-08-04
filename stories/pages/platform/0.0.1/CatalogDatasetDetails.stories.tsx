import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'right-empty-classes',
  'right-loading',
  'dataset-details-overflow',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Dataset Details',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Dataset class and member details panel. Names describe the panel purpose rather than its right-side position.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'right-empty-classes', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const NoConnectedClasses: Story = { name: 'No connected classes' }
export const Loading: Story = { name: 'Loading', args: { scenario: 'right-loading' } }
export const Overflow: Story = { name: 'Class and member overflow', args: { scenario: 'dataset-details-overflow' } }
