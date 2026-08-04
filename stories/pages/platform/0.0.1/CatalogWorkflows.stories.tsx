import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { playDialogHeading } from './catalog/catalog-story-plays'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = [
  'modal-add-dataset',
  'modal-igp-export-progress',
  'modal-upload-quality',
  'modal-bulk-delete',
  'modal-export-config',
  'modal-transfer-move',
] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Workflows',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Representative dataset, upload, delete, export, and transfer workflows. Component-only dialog permutations are not duplicated here.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'modal-add-dataset', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const AddDatasetDialog: Story = {
  name: 'Add dataset dialog',
  play: playDialogHeading('Add dataset'),
}
export const DatasetIgpExportDialog: Story = {
  name: 'Dataset IGP export dialog',
  args: { scenario: 'modal-igp-export-progress' },
  play: playDialogHeading('Export (.igp)'),
}
export const UploadQualityDialog: Story = {
  name: 'Upload quality dialog',
  args: { scenario: 'modal-upload-quality' },
  play: playDialogHeading('Upload quality'),
}
export const DeleteImagesDialog: Story = {
  name: 'Delete images dialog',
  args: { scenario: 'modal-bulk-delete' },
  play: playDialogHeading('Delete 3 images'),
}
export const GalleryExportDialog: Story = {
  name: 'Gallery export dialog',
  args: { scenario: 'modal-export-config' },
  play: playDialogHeading('Export Data'),
}
export const TransferImagesDialog: Story = {
  name: 'Transfer images dialog',
  args: { scenario: 'modal-transfer-move' },
  play: playDialogHeading('Move to dataset'),
}
