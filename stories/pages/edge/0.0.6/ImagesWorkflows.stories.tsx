// Images workflows: selection, deletion, date filter and inspector.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Workspace005, * as W from '../0.0.5/Workspace.stories'
import * as I from '../0.0.5/ImagesWorkflows.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Images/Workflows',
  component: Workspace005.component,
  args: { ...Workspace005.args, activeTab: 'images' },
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Images',
    referenceStory: 'Pages / Edge / 0.0.6 / Images / Workflows / Select and delete',
    fixturesPath: 'stories/fixtures/edge/0.0.5/temp-images.ts',
    requiredScenarios: ['selection-delete', 'group-selection', 'filter-date', 'inspector', 'session-selection'],
    interactions: ['No deletion, labeling persistence, camera or backend operations. Fixed preview clock: 20 May 2026.'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const SelectionDelete: Story = { ...I.SelectionDeleteWorkflow, name: 'Select and delete', play: paced(I.SelectionDeleteWorkflow.play) }
export const GroupSelection: Story = { ...I.GroupSelectionWorkflow, name: 'Select a group', play: paced(I.GroupSelectionWorkflow.play) }
export const FilterDate: Story = { ...I.FilterDateWorkflow, name: 'Filter by date', play: paced(I.FilterDateWorkflow.play) }
export const Inspector: Story = { ...I.InspectorWorkflow, name: 'Open inspector', play: paced(I.InspectorWorkflow.play) }
export const SessionSelection: Story = { ...W.ImagesSessionWorkflow, name: 'Selection survives tab change', play: paced(W.ImagesSessionWorkflow.play) }
