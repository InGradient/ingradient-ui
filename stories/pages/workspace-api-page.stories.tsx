import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse, delay } from 'msw'
import { AppShell, PageContent, PageHeader, PageHeaderRow, PageSubtitle, PageTitle, PageTitleBlock, Panel, PanelHeader, PanelHint, PanelTitle, Toolbar } from '@ingradient/ui/patterns'
import { Alert, Button, EmptyState, SearchField, SelectField, Spinner, Table } from '@ingradient/ui/components'

type WorkspaceRow = {
  id: string
  name: string
  owner: string
  status: string
}

type ApiResponse = {
  items: WorkspaceRow[]
}

const meta = {
  title: 'Pages/Connected Workspace Page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const realisticRows: WorkspaceRow[] = [
  { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'active' },
  { id: '2', name: 'Label audit', owner: 'M. Park', status: 'needs review' },
  { id: '3', name: 'Clinical export', owner: 'S. Lee', status: 'blocked' },
  { id: '4', name: 'Partner onboarding', owner: 'D. Choi', status: 'draft' },
]

const sparseRows: WorkspaceRow[] = [
  { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'active' },
]

const overloadedRows: WorkspaceRow[] = Array.from({ length: 18 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Workspace ${index + 1}`,
  owner: ['J. Kim', 'M. Park', 'S. Lee'][index % 3],
  status: ['active', 'needs review', 'blocked', 'draft'][index % 4],
}))

const columns = [
  { key: 'name', header: 'Workspace', render: (row: WorkspaceRow) => row.name },
  { key: 'owner', header: 'Owner', render: (row: WorkspaceRow) => row.owner },
  { key: 'status', header: 'Status', render: (row: WorkspaceRow) => row.status },
]

function ConnectedWorkspacePage({ endpoint }: { endpoint: string }) {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('all')
  const [state, setState] = React.useState<{
    status: 'loading' | 'success' | 'error'
    items: WorkspaceRow[]
  }>({
    status: 'loading',
    items: [],
  })

  React.useEffect(() => {
    let active = true

    const run = async () => {
      setState({ status: 'loading', items: [] })

      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data = (await response.json()) as ApiResponse
        if (!active) return
        setState({ status: 'success', items: data.items })
      } catch {
        if (!active) return
        setState({ status: 'error', items: [] })
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [endpoint])

  const visibleRows = state.items.filter((row) => {
    const matchesQuery = row.name.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'all' || row.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <AppShell style={{ minHeight: 760 }}>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Connected Workspace Directory</PageTitle>
            <PageSubtitle>
              This page story uses MSW to simulate API success, empty, error, and delayed loading states.
            </PageSubtitle>
          </PageTitleBlock>
          <Button variant="accent">Create workspace</Button>
        </PageHeaderRow>
      </PageHeader>
      <PageContent>
        <Alert $tone="info">
          Use Storybook globals and story variants together. Globals change role and density, while MSW handlers change server state.
        </Alert>
        <Panel>
          <PanelHeader>
            <PanelTitle>All workspaces</PanelTitle>
            <PanelHint>
              {state.status === 'success' ? `${visibleRows.length} items visible` : state.status}
            </PanelHint>
          </PanelHeader>
          <Toolbar>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 12, width: '100%' }}>
              <SearchField
                placeholder="Search workspace"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                disabled={state.status !== 'success'}
              />
              <SelectField
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                disabled={state.status !== 'success'}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="needs review">Needs review</option>
                <option value="blocked">Blocked</option>
                <option value="draft">Draft</option>
              </SelectField>
            </div>
          </Toolbar>
          <div style={{ padding: 20 }}>
            {state.status === 'loading' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 180 }}>
                <Spinner aria-label="Loading workspaces" />
                <span style={{ color: 'var(--ig-color-text-muted)' }}>Loading workspaces…</span>
              </div>
            ) : null}

            {state.status === 'error' ? (
              <EmptyState
                title="Failed to load workspaces"
                description="The request could not be completed. Check the error story or retry with a success handler."
                action={{ label: 'Retry', onClick: () => window.location.reload() }}
              />
            ) : null}

            {state.status === 'success' && visibleRows.length === 0 ? (
              <EmptyState
                title="No matching workspaces"
                description="The API returned no items or the current filters removed every row."
                action={{ label: 'Reset filters', onClick: () => { setQuery(''); setStatus('all') } }}
              />
            ) : null}

            {state.status === 'success' && visibleRows.length > 0 ? (
              <Table columns={columns} rows={visibleRows} draggable onReorder={() => undefined} />
            ) : null}
          </div>
        </Panel>
      </PageContent>
    </AppShell>
  )
}

function buildHandlers(mode: 'success' | 'empty' | 'error' | 'loading') {
  return [
    http.get('/api/storybook/workspaces', async ({ request }) => {
      const url = new URL(request.url)
      const scale = url.searchParams.get('scale') ?? 'realistic'

      if (mode === 'loading') {
        await delay(60_000)
        return HttpResponse.json({ items: [] })
      }

      if (mode === 'error') {
        await delay(700)
        return new HttpResponse(null, { status: 500 })
      }

      const items =
        mode === 'empty'
          ? []
          : scale === 'sparse'
            ? sparseRows
            : scale === 'overloaded'
              ? overloadedRows
              : realisticRows

      await delay(500)
      return HttpResponse.json({ items })
    }),
  ]
}

function endpointFromScale(scale: string) {
  return `/api/storybook/workspaces?scale=${encodeURIComponent(scale)}`
}

export const Success: Story = {
  parameters: {
    msw: {
      handlers: buildHandlers('success'),
    },
    a11y: {
      test: 'error',
    },
  },
  render: (_, context) => <ConnectedWorkspacePage endpoint={endpointFromScale(String(context.globals.dataScale ?? 'realistic'))} />,
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: buildHandlers('empty'),
    },
    a11y: {
      test: 'error',
    },
  },
  render: () => <ConnectedWorkspacePage endpoint={endpointFromScale('realistic')} />,
}

export const ErrorState: Story = {
  name: 'Error',
  parameters: {
    msw: {
      handlers: buildHandlers('error'),
    },
    a11y: {
      test: 'error',
    },
  },
  render: () => <ConnectedWorkspacePage endpoint={endpointFromScale('realistic')} />,
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: buildHandlers('loading'),
    },
    a11y: {
      test: 'todo',
    },
  },
  render: () => <ConnectedWorkspacePage endpoint={endpointFromScale('realistic')} />,
}
