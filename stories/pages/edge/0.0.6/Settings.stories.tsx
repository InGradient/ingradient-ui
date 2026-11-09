// System Settings: the dialog over the capture page, one story per tab in app order.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Workspace005 from '../0.0.5/Workspace.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Settings/Tabs',
  component: Workspace005.component,
  args: { ...Workspace005.args, activeTab: 'capture', settingsOpen: true },
  // The dialog covers the whole Docs page, so these open from the sidebar only.
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Settings',
    referenceStory: 'Pages / Edge / 0.0.6 / Settings / Tabs / Connection',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['general', 'connection', 'camera', 'capture', 'lighting', 'server', 'data', 'logs', 'experiments', 'field-test', 'about'],
    interactions: ['Tab switching; edits and outcomes: see Settings / Workflows and Settings / Tab Workflows'],
  }),
} satisfies Meta<typeof Workspace005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const General: Story = { name: 'General', args: { settingsTab: 'general' } }
/** Six-step connection diagnosis and network scan. */
export const Connection: Story = { name: 'Connection', args: { settingsTab: 'connection' } }
export const Camera: Story = { name: 'Camera', args: { settingsTab: 'camera' } }
export const Capture: Story = { name: 'Capture', args: { settingsTab: 'capture' } }
export const Lighting: Story = { name: 'Lighting', args: { settingsTab: 'lighting' } }
export const Server: Story = { name: 'Server', args: { settingsTab: 'server' } }
export const Data: Story = { name: 'Data', args: { settingsTab: 'data' } }
export const Logs: Story = { name: 'Logs', args: { settingsTab: 'logs' } }
export const Experiments: Story = { name: 'Experiments', args: { settingsTab: 'experiments' } }
export const FieldTest: Story = { name: 'Field test', args: { settingsTab: 'fieldtest' } }
export const About: Story = { name: 'About', args: { settingsTab: 'about' } }
