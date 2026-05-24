import type { Meta, StoryObj } from '@storybook/react-vite'
import { SyncStatusChip } from './sync-status-chip'
import { Inline, Stack } from '../../primitives'

const meta: Meta<typeof SyncStatusChip> = {
  title: 'Components/Feedback/SyncStatusChip',
  component: SyncStatusChip,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Stack gap={3}>
      <Inline gap={3}>
        <SyncStatusChip state="synced" />
        <SyncStatusChip state="uploading" />
        <SyncStatusChip state="upload_failed" />
        <SyncStatusChip state="local_only" />
      </Inline>
      <Inline gap={3}>
        <SyncStatusChip state="synced" showDot={false} />
        <SyncStatusChip state="uploading" showDot={false} />
        <SyncStatusChip state="upload_failed" label="Retry needed" />
      </Inline>
    </Stack>
  ),
}

export const Synced: Story = { args: { state: 'synced' } }
export const Uploading: Story = { args: { state: 'uploading' } }
export const UploadFailed: Story = { args: { state: 'upload_failed' } }
export const LocalOnly: Story = { args: { state: 'local_only' } }
export const CollapsedUntilHover: Story = {
  render: () => (
    <Inline gap={3}>
      <SyncStatusChip state="synced" variant="opaque" showDot={false} collapseUntilHover />
      <SyncStatusChip state="uploading" variant="opaque" showDot={false} collapseUntilHover />
      <SyncStatusChip state="upload_failed" variant="opaque" showDot={false} collapseUntilHover />
      <SyncStatusChip state="local_only" variant="opaque" showDot={false} collapseUntilHover />
    </Inline>
  ),
}
