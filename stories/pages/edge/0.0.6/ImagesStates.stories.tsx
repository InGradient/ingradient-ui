// Images states: the image inspector opened on the first image, view-only or editing.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005 from '../0.0.5/Workspace.stories'
import { DIALOG_ONLY, edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Images/System States',
  component: Workspace005.component,
  args: { ...Workspace005.args, activeTab: 'images' },
  ...DIALOG_ONLY,
  parameters: edge006Parameters({
    page: 'Images',
    referenceStory: 'Pages / Edge / 0.0.6 / Images / System States / Image inspector',
    fixturesPath: 'stories/fixtures/edge/0.0.5/temp-images.ts',
    requiredScenarios: ['inspector-view', 'inspector-edit'],
    interactions: ['Editing uses the synthetic bbox canvas from 0.0.1; nothing is saved'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

/** Inspector open, view only (Previous/Next and arrow keys). */
export const InspectorView: Story = { name: 'Image inspector', args: { imagesInspector: 'view' } }
/** Inspector open with the bbox toolbar and drawing canvas. */
export const InspectorEdit: Story = { name: 'Image inspector (editing)', args: { imagesInspector: 'edit' } }
