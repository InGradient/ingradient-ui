import type { Meta, StoryObj } from '@storybook/react-vite'
import { SyncStatusChip } from './sync-status-chip'
import { Inline, Stack } from '@ingradient/ui/primitives'

const meta: Meta<typeof SyncStatusChip> = {
  id: 'platform-pages-catalog-gallery-syncstatuschip',
  title: 'Components/Platform/Catalog/Gallery/SyncStatusChip',
  component: SyncStatusChip,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  render: () => (
    <Stack gap="var(--ig-spacing-8)">
      <Inline gap="var(--ig-spacing-8)">
        <SyncStatusChip state="synced" />
        <SyncStatusChip state="uploading" />
        <SyncStatusChip state="upload_failed" />
        <SyncStatusChip state="local_only" />
      </Inline>
      <Inline gap="var(--ig-spacing-8)">
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
