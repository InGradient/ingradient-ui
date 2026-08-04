import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CatalogScenarioKey } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { playImageInspector } from './catalog/catalog-story-plays'
import {
  DatasetCatalogScene,
  catalogArgTypes,
  catalogParameters,
  createCatalogActionArgs,
} from './catalog/catalog-story-runtime'

const SCENARIOS = ['detail-with-comments'] as const satisfies readonly CatalogScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dataset Catalog/Image Inspector',
  component: DatasetCatalogScene,
  tags: ['autodocs'],
  parameters: catalogParameters(
    'Integrated image inspector with a full-width media workspace, metadata, classes, and comments.',
  ),
  argTypes: catalogArgTypes(SCENARIOS),
  args: { scenario: 'detail-with-comments', ...createCatalogActionArgs() },
} satisfies Meta<typeof DatasetCatalogScene>

export default meta
type Story = StoryObj<typeof meta>

export const WithComments: Story = {
  name: 'With comments',
  play: playImageInspector,
}
