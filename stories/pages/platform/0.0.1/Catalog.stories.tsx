import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Alert, Badge, Button, Card, EmptyState, FilterBarLayout, SearchField, SelectionActionBar,
  Spinner, StatusPill, type StatusTone,
} from '@ingradient/ui/components'
import { ListDetailLayout, PageContent, PageHeader, PageTitle, PageTitleBlock, Panel, PanelHeader, PanelTitle } from '@ingradient/ui/patterns'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { catalogScenarios, type CatalogScenario, type MockDataset } from '../../../fixtures/platform/0.0.1/catalog-scenarios'
import { scenarioArgType } from '../../../support/scenarios'
import {
  filterStyleArg, rightPanelArg, sidebarArg, selectionModeArg, viewModeArg,
  type FilterStyle, type RightPanelState, type SelectionMode, type SidebarState, type ViewMode,
} from '../../../support/page-controls'

type Args = {
  scenario: CatalogScenario
  viewMode: ViewMode
  sidebar: SidebarState
  rightPanel: RightPanelState
  filterStyle: FilterStyle
  selectionMode: SelectionMode
}

const statusTone: Record<MockDataset['status'], StatusTone> = {
  ready: 'completed',
  syncing: 'running',
  failed: 'failed',
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--ig-color-bg-canvas)',
  display: 'flex',
}

const sidebarStyle: React.CSSProperties = {
  background: 'var(--ig-color-surface-panel)',
  borderRight: '1px solid var(--ig-color-border-subtle)',
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-4)',
}

const tableHeaderStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '32px 1fr 100px 120px 100px',
  gap: 'var(--ig-space-4)',
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  fontWeight: 600,
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const tableRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '32px 1fr 100px 120px 100px',
  gap: 'var(--ig-space-4)',
  padding: 'var(--ig-space-4) var(--ig-space-5)',
  alignItems: 'center',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const nameCell: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-primary)',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const metaCell: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  fontFamily: 'var(--ig-font-mono)',
}

const gridCardBody: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
}

function SidebarColumn({ state }: { state: SidebarState }) {
  if (state === 'hidden') return null
  return (
    <aside style={{ ...sidebarStyle, width: state === 'compact' ? 72 : 240 }}>
      <Inline gap={2} align="center">
        <div style={{ width: 32, height: 32, background: 'var(--ig-color-accent)', borderRadius: 8 }} />
        {state === 'expanded' ? <span style={{ fontWeight: 600 }}>INGRADIENT</span> : null}
      </Inline>
      <Stack gap={1}>
        {['Dashboard', 'Catalog', 'Classes', 'Settings'].map((item) => (
          <Button key={item} variant={item === 'Catalog' ? 'accent' : 'secondary'} size="sm">
            {state === 'expanded' ? item : item[0]}
          </Button>
        ))}
      </Stack>
    </aside>
  )
}

function FilterControls({ filterStyle: fs, selectedCount }: { filterStyle: FilterStyle; selectedCount: number }) {
  return (
    <FilterBarLayout>
      <SearchField placeholder="Search datasets…" value="" onChange={() => undefined} />
      {fs === 'chips' ? (
        <Inline gap={2}>
          <Badge $tone="accent">Ready</Badge>
          <Badge $tone="warning">Syncing</Badge>
          <Badge $tone="danger">Failed</Badge>
        </Inline>
      ) : fs === 'dropdown' ? (
        <Button variant="secondary" size="sm">Status: All</Button>
      ) : (
        <Button variant="secondary" size="sm">Open filters</Button>
      )}
      {selectedCount > 0 ? <Badge $tone="accent">{selectedCount} selected</Badge> : null}
    </FilterBarLayout>
  )
}

function DatasetTable({ datasets, selectedIds }: { datasets: MockDataset[]; selectedIds: string[] }) {
  return (
    <div>
      <div style={tableHeaderStyle}>
        <span />
        <span>Name</span>
        <span>Images</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      {datasets.map((d) => (
        <div key={d.id} style={tableRowStyle}>
          <input type="checkbox" checked={selectedIds.includes(d.id)} readOnly />
          <span style={nameCell}>{d.name}</span>
          <span style={metaCell}>{d.imageCount.toLocaleString()}</span>
          <StatusPill tone={statusTone[d.status]}>{d.status}</StatusPill>
          <span style={metaCell}>{d.lastUpdatedAt}</span>
        </div>
      ))}
    </div>
  )
}

function DatasetGrid({ datasets }: { datasets: MockDataset[] }) {
  return (
    <Grid gap={4} columns="repeat(auto-fill, minmax(240px, 1fr))">
      {datasets.map((d) => (
        <Card key={d.id}>
          <div style={gridCardBody}>
            <Inline justify="space-between" align="center">
              <span style={nameCell}>{d.name}</span>
              <StatusPill tone={statusTone[d.status]}>{d.status}</StatusPill>
            </Inline>
            <span style={metaCell}>{d.imageCount.toLocaleString()} images</span>
            <span style={metaCell}>{d.lastUpdatedAt} · {d.owner}</span>
          </div>
        </Card>
      ))}
    </Grid>
  )
}

function RightPanel({ dataset }: { dataset: MockDataset | undefined }) {
  if (!dataset) return null
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{dataset.name}</PanelTitle>
      </PanelHeader>
      <div style={{ padding: 'var(--ig-space-5)' }}>
        <Stack gap={3}>
          <Inline justify="space-between"><span style={metaCell}>Owner</span><span>{dataset.owner}</span></Inline>
          <Inline justify="space-between"><span style={metaCell}>Images</span><span>{dataset.imageCount.toLocaleString()}</span></Inline>
          <Inline justify="space-between"><span style={metaCell}>Status</span><StatusPill tone={statusTone[dataset.status]}>{dataset.status}</StatusPill></Inline>
          <Inline justify="space-between"><span style={metaCell}>Updated</span><span>{dataset.lastUpdatedAt}</span></Inline>
        </Stack>
      </div>
    </Panel>
  )
}

function CatalogScene(args: Args) {
  const scene = catalogScenarios[args.scenario]
  const selectedFirst = scene.datasets.find((d) => scene.selectedIds.includes(d.id))

  return (
    <div style={pageStyle}>
      <SidebarColumn state={args.sidebar} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <PageHeader>
          <PageTitleBlock>
            <PageTitle>Catalog</PageTitle>
            <Inline gap={2} align="center">
              <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>
                Organize datasets, manage dataset-class links, browse labeled images.
              </span>
              <Badge $tone="neutral">Project: Wafer-2026</Badge>
            </Inline>
          </PageTitleBlock>
          <Inline gap={2}>
            <Button variant="secondary" size="sm">Import</Button>
            <Button variant="accent" size="sm">New dataset</Button>
          </Inline>
        </PageHeader>
        <PageContent>
          {scene.permissionDenied ? (
            <Alert $tone="warning">You don&apos;t have permission to view datasets in this project.</Alert>
          ) : scene.error ? (
            <Alert $tone="danger">{scene.error}</Alert>
          ) : scene.loading ? (
            <Stack gap={3} align="center"><Spinner size="lg" /><span style={metaCell}>Loading datasets…</span></Stack>
          ) : scene.datasets.length === 0 ? (
            <EmptyState title="No datasets yet" description="Create your first dataset to start labeling." />
          ) : (
            <ListDetailLayout style={{ gridTemplateColumns: args.rightPanel === 'open' ? 'minmax(0,1fr) 320px' : 'minmax(0,1fr)' }}>
              <Stack gap={4}>
                <FilterControls filterStyle={args.filterStyle} selectedCount={scene.selectedIds.length} />
                {args.viewMode === 'table' ? (
                  <DatasetTable datasets={scene.datasets} selectedIds={scene.selectedIds} />
                ) : (
                  <DatasetGrid datasets={scene.datasets} />
                )}
              </Stack>
              {args.rightPanel === 'open' ? <RightPanel dataset={selectedFirst ?? scene.datasets[0]} /> : null}
            </ListDetailLayout>
          )}
        </PageContent>
        {scene.selectedIds.length > 0 ? (
          <SelectionActionBar
            selectedCount={scene.selectedIds.length}
            totalCount={scene.datasets.length}
            onClearSelection={() => undefined}
            actions={<Inline gap={2}>
              {scene.exportReady ? <Button variant="accent" size="sm">Export</Button> : null}
              <Button variant="secondary" size="sm" tone="danger">Delete</Button>
            </Inline>}
          />
        ) : null}
      </div>
    </div>
  )
}

const meta = {
  title: 'Pages/Platform/0.0.1/Catalog',
  component: CatalogScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    scenario: scenarioArgType(['huge-dataset', 'syncing', 'multi-selection', 'export-ready']),
    viewMode: viewModeArg,
    sidebar: sidebarArg,
    rightPanel: rightPanelArg,
    filterStyle: filterStyleArg,
    selectionMode: selectionModeArg,
  },
  args: {
    scenario: 'default',
    viewMode: 'table',
    sidebar: 'expanded',
    rightPanel: 'open',
    filterStyle: 'chips',
    selectionMode: 'multi',
  },
} satisfies Meta<typeof CatalogScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { scenario: 'empty' } }
export const Loading: Story = { args: { scenario: 'loading' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const HugeDataset: Story = { args: { scenario: 'huge-dataset' } }
export const LongNames: Story = { args: { scenario: 'long-text' } }
export const ManyItems: Story = { args: { scenario: 'many-items', viewMode: 'grid' } }
export const Syncing: Story = { args: { scenario: 'syncing' } }
export const MultiSelection: Story = { args: { scenario: 'multi-selection' } }
export const ExportReady: Story = { args: { scenario: 'export-ready' } }
export const GridView: Story = { args: { viewMode: 'grid' } }
export const CompactSidebar: Story = { args: { sidebar: 'compact' } }
export const NoRightPanel: Story = { args: { rightPanel: 'closed' } }
