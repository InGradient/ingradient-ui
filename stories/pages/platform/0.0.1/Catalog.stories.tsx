import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'default',
  'table-view',
  'many-images',
  'long-text',
  'multi-selection',
  'sidebar-collapsed',
  'drag-over-sidebar',
  'drag-over-grid',
  'drag-over-full',
  'upload-in-progress',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Workspace',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Canonical Dataset Catalog workspace layouts, content stress cases, selection, upload, and drop-target states.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
export const ImageTable: Story = { name: 'Image table', args: { scenario: 'table-view' } }
export const LargeImageSet: Story = { name: 'Large image set', args: { scenario: 'many-images' } }
export const LongImageNames: Story = { name: 'Long image names', args: { scenario: 'long-text' } }
export const ImagesSelected: Story = { name: 'Images selected', args: { scenario: 'multi-selection' } }
export const DatasetSidebarCollapsed: Story = {
  name: 'Dataset sidebar collapsed',
  args: { scenario: 'sidebar-collapsed' },
}
export const DropOnDataset: Story = { name: 'Drop on dataset', args: { scenario: 'drag-over-sidebar' } }
export const DropOnGallery: Story = { name: 'Drop on image gallery', args: { scenario: 'drag-over-grid' } }
export const PageDropzone: Story = { name: 'Page dropzone', args: { scenario: 'drag-over-full' } }
export const UploadProgress: Story = { name: 'Upload progress', args: { scenario: 'upload-in-progress' } }
