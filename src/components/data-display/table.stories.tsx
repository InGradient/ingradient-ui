import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table, type TableProps } from './table'
import { EmptyState } from '../feedback/empty-state'
import { cloneTableRows, resolveReviewScale, type ReviewScale } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'
import type { ReviewWorkspaceRow } from '@storybook-support/../fixtures/review-fixtures'

type TableStoryArgs = {
  dataset: ReviewScale | 'auto'
  emptyState: boolean
  draggable: boolean
}

const columns: TableProps<ReviewWorkspaceRow>['columns'] = [
  { key: 'name', header: 'Workspace', render: (row) => row.name },
  { key: 'owner', header: 'Owner', render: (row) => row.owner },
  { key: 'status', header: 'Status', render: (row) => row.status },
]

function StoryTable(props: TableProps<ReviewWorkspaceRow>) {
  return <Table<ReviewWorkspaceRow> {...props} />
}

const meta = {
  title: 'Components/Data Display/Table',
  component: StoryTable as unknown as React.ComponentType<TableStoryArgs>,
  tags: ['autodocs'],
  args: {
    dataset: 'auto',
    emptyState: false,
    draggable: false,
  },
  argTypes: {
    dataset: {
      control: 'inline-radio',
      options: ['auto', 'sparse', 'realistic', 'overloaded'],
      description: 'Use Storybook data scale or force a specific review dataset.',
    },
    emptyState: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<TableStoryArgs>

export default meta

type Story = StoryObj<TableStoryArgs>

export const Playground: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const [rows, setRows] = React.useState(cloneTableRows(scale))
    const [selected, setSelected] = React.useState<ReviewWorkspaceRow | null>(null)

    return (
      <StorybookStack gap={12}>
        <StoryTable
          columns={columns}
          rows={args.emptyState ? [] : rows}
          draggable={args.draggable}
          onReorder={setRows}
          onRowClick={setSelected}
          getRowAriaLabel={(row) => `Open workspace ${row.name}`}
        />
        <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
          Selected row: <strong>{selected?.name ?? 'none'}</strong>. Click a row, or focus it and press Enter or Space.
        </div>
      </StorybookStack>
    )
  },
}

type StorageRow = { id: string; name: string; files: number; sizeBytes: number; lastUsed: string }
const storageColumns: TableProps<StorageRow>['columns'] = [
  { key: 'name', header: 'Dataset', render: (row) => row.name },
  { key: 'files', header: 'Files', numeric: true, render: (row) => row.files.toLocaleString() },
  { key: 'size', header: 'Size (MB)', numeric: true, render: (row) => (row.sizeBytes / (1024 * 1024)).toFixed(1) },
  { key: 'lastUsed', header: 'Last used', muted: true, render: (row) => row.lastUsed },
]
const storageRows: StorageRow[] = [
  { id: 'a', name: 'Wafer line A', files: 12_482, sizeBytes: 4_200_000_000, lastUsed: '2026-05-25' },
  { id: 'b', name: 'Surface defects', files: 3_021, sizeBytes: 980_000_000, lastUsed: '2026-05-21' },
  { id: 'c', name: 'Keypoint annotations', files: 786, sizeBytes: 220_000_000, lastUsed: '2026-04-30' },
]

export const WithFooter: Story = {
  args: { dataset: 'auto', emptyState: false, draggable: false },
  render: () => {
    const totalFiles = storageRows.reduce((a, r) => a + r.files, 0)
    const totalBytes = storageRows.reduce((a, r) => a + r.sizeBytes, 0)
    return (
      <StorybookStack gap={12}>
        <Table<StorageRow>
          columns={storageColumns}
          rows={storageRows}
          getRowKey={(row) => row.id}
          footer={[
            'Total',
            totalFiles.toLocaleString(),
            (totalBytes / (1024 * 1024)).toFixed(1),
            '',
          ]}
          ariaLabel="Storage stats table"
        />
        <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
          numeric column 은 right-align + tabular-nums, muted column 은 회색, footer 는 tfoot 으로 강조됨.
        </div>
      </StorybookStack>
    )
  },
}

export const Review: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const [rows, setRows] = React.useState(cloneTableRows(scale))

    return (
      <StorybookPage
        title="Table"
        description="Tables should be reviewed with realistic row density, empty states, and reorder behavior, not just with a three-row happy path."
        meta={
          <StorybookMetaBar
            items={[
              { label: 'stable', tone: 'success' },
              { label: 'consumer-verified', tone: 'accent' },
              { label: `${scale} data`, tone: scale === 'overloaded' ? 'warning' : 'neutral' },
            ]}
          />
        }
      >
        <StorybookSection
          title="Review surface"
          description="Switch the global data scale to see sparse, realistic, and overloaded table density without changing component code."
        >
          <StorybookGrid columns="1fr 1fr">
            <StorybookCard title="Default table" subtitle="row click + drag reorder">
              <StoryTable columns={columns} rows={args.emptyState ? [] : rows} draggable onReorder={setRows} />
            </StorybookCard>
            <StorybookCard title="Empty state" subtitle="rows가 없을 때는 별도 상태를 분리한다">
              <StorybookStack>
                <EmptyState
                  title="No rows available"
                  description="Create a workspace or sync data from the source system to populate this table."
                />
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
