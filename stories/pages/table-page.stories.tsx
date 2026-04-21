import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppShell, PageContent, PageHeader, PageHeaderRow, PageSubtitle, PageTitle, PageTitleBlock, Panel, PanelHeader, PanelHint, PanelTitle, Toolbar } from '@ingradient/ui/patterns'
import { Alert, Button, EmptyState, SearchField, SelectField, Table } from '@ingradient/ui/components'

type WorkspaceRow = {
  id: string
  name: string
  owner: string
  status: string
}

const meta = {
  title: 'Pages/Table Page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const baseRows: WorkspaceRow[] = [
  { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'Active' },
  { id: '2', name: 'Label audit', owner: 'M. Park', status: 'Needs review' },
  { id: '3', name: 'Clinical export', owner: 'S. Lee', status: 'Blocked' },
  { id: '4', name: 'Partner onboarding', owner: 'D. Choi', status: 'Draft' },
  { id: '5', name: 'Mobile QA board', owner: 'A. Han', status: 'Archived' },
]

const columns = [
  { key: 'name', header: 'Workspace', render: (row: WorkspaceRow) => row.name },
  { key: 'owner', header: 'Owner', render: (row: WorkspaceRow) => row.owner },
  { key: 'status', header: 'Status', render: (row: WorkspaceRow) => row.status },
]

function rowsForScale(scale: string) {
  if (scale === 'sparse') return baseRows.slice(0, 1)
  if (scale === 'overloaded') return [...baseRows, ...baseRows, ...baseRows].map((row, index) => ({ ...row, id: `${row.id}-${index}` }))
  return baseRows
}

export const Default: Story = {
  render: (_, context) => {
    const role = String(context.globals.role ?? 'editor')
    const dataScale = String(context.globals.dataScale ?? 'realistic')
    const [query, setQuery] = React.useState('')
    const [status, setStatus] = React.useState('all')

    const visibleRows = rowsForScale(dataScale).filter((row) => {
      const matchesQuery = row.name.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === 'all' || row.status.toLowerCase() === status
      return matchesQuery && matchesStatus
    })

    const canEdit = role !== 'viewer'

    return (
      <AppShell style={{ minHeight: 760 }}>
        <PageHeader>
          <PageHeaderRow>
            <PageTitleBlock>
              <PageTitle>Workspace Directory</PageTitle>
              <PageSubtitle>
                Storybook page story that reflects role, data scale, and filter state without leaving the design system.
              </PageSubtitle>
            </PageTitleBlock>
            {canEdit ? <Button variant="accent">Create workspace</Button> : null}
          </PageHeaderRow>
        </PageHeader>
        <PageContent>
          {role === 'viewer' ? (
            <Alert $tone="info">Viewer role can inspect state but cannot create or reorder workspaces.</Alert>
          ) : null}
          <Panel>
            <PanelHeader>
              <PanelTitle>All workspaces</PanelTitle>
              <PanelHint>{visibleRows.length} items visible</PanelHint>
            </PanelHeader>
            <Toolbar>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 12, width: '100%' }}>
                <SearchField
                  placeholder="Search workspace"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery('')}
                />
                <SelectField value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="needs review">Needs review</option>
                  <option value="blocked">Blocked</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </SelectField>
              </div>
            </Toolbar>
            <div style={{ padding: 20 }}>
              {visibleRows.length === 0 ? (
                <EmptyState
                  title="No matching workspaces"
                  description="Try a broader keyword or reset one of the active filters."
                  action={canEdit ? { label: 'Reset filters', onClick: () => { setQuery(''); setStatus('all') } } : undefined}
                />
              ) : (
                <Table columns={columns} rows={visibleRows} draggable={canEdit} onReorder={() => undefined} />
              )}
            </div>
          </Panel>
        </PageContent>
      </AppShell>
    )
  },
}
