import type { Meta, StoryObj } from '@storybook/react-vite'
import { SyncStatusChip } from './sync-status-chip'
import { Inline, Stack } from '@ingradient/ui/primitives'

const meta: Meta<typeof SyncStatusChip> = {
  title: 'Platform Pages/Catalog/Gallery/SyncStatusChip',
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
