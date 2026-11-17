// Log panel and setup workflows, shown in the panels they run in.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Controls005, * as C from '../0.0.5/CaptureControls.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Log and Setup Workflows',
  component: Controls005.component,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Log and Setup Workflows / Log filter and image detail',
    fixturesPath: 'stories/pages/edge/0.0.5/workspace/capture-fixtures.ts',
    requiredScenarios: ['log-filter-image', 'setup-simulation'],
    interactions: ['Log filter and keyboard detail, synthetic image modal, setup simulation'],
  }),
} satisfies Meta<typeof Controls005.component>

export default meta
type Story = StoryObj<typeof Controls005>

export const LogFilterImage: Story = { ...C.LogFilterKeyboardImageWorkflow, name: 'Log filter and image detail', play: paced(C.LogFilterKeyboardImageWorkflow.play) }
export const SetupSimulation: Story = { ...C.SetupSimulationWorkflow, name: 'Setup simulation', play: paced(C.SetupSimulationWorkflow.play) }
