import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'empty-datasets',
  'empty-images',
  'loading-datasets',
  'loading-images',
  'error',
  'permission-denied',
  'no-project',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/System States',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Dataset Catalog empty, loading, error, permission, and project-selection states.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'empty-datasets', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const NoDatasets: Story = { name: 'No datasets' }
export const NoImages: Story = { name: 'No images', args: { scenario: 'empty-images' } }
export const DatasetsLoading: Story = { name: 'Datasets loading', args: { scenario: 'loading-datasets' } }
export const ImagesLoading: Story = { name: 'Images loading', args: { scenario: 'loading-images' } }
export const ImageLoadError: Story = { name: 'Image load error', args: { scenario: 'error' } }
export const AccessDenied: Story = { name: 'Access denied', args: { scenario: 'permission-denied' } }
export const NoProjectSelected: Story = { name: 'No project selected', args: { scenario: 'no-project' } }
