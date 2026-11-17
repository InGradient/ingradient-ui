// Settings tab workflows: device, network, logs, lighting, maintenance and updates.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Settings005, * as S from '../0.0.5/SettingsWorkflows.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Settings/Tab Workflows',
  component: Settings005.component,
  args: Settings005.args,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Settings',
    referenceStory: 'Pages / Edge / 0.0.6 / Settings / Tab Workflows / Server and camera',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['server-camera', 'force-ip', 'logs', 'lighting-ps', 'cache-cleanup', 'field-test', 'license-update'],
    interactions: ['Session-local mock settings and explicit synthetic outcomes; no hardware, network or file operations'],
  }),
} satisfies Meta<typeof Settings005.component>

export default meta
type Story = StoryObj<typeof Settings005>

export const ServerCamera: Story = { ...S.DeviceDraft, name: 'Server and camera', play: paced(S.DeviceDraft.play) }
export const ForceIp: Story = { ...S.ForceIp, name: 'Force IP', play: paced(S.ForceIp.play) }
export const Logs: Story = { ...S.Logs, name: 'Logs search, level and export', play: paced(S.Logs.play) }
export const LightingPs: Story = { ...S.LightingPs, name: 'Photometric stereo lighting', play: paced(S.LightingPs.play) }
export const CacheCleanup: Story = { ...S.CacheCleanup, name: 'Cache cleanup', play: paced(S.CacheCleanup.play) }
export const FieldTest: Story = { ...S.FieldTest, name: 'Field test', play: paced(S.FieldTest.play) }
export const LicenseUpdate: Story = { ...S.AboutUpdate, name: 'License and update', play: paced(S.AboutUpdate.play) }
