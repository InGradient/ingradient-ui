import React from 'react'
import { BrandMark } from '@ingradient/ui/brand'
import { IngradientGlobalStyle, IngradientThemeProvider, spacingScale } from '@ingradient/ui'
import { Alert, Button, SearchField, Table, TagList } from '@ingradient/ui/components'
import {
  AppShell,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
  Panel,
  PanelHeader,
  PanelHint,
  PanelTitle,
  Toolbar,
} from '@ingradient/ui/patterns'
import './smoke.css'

type SmokeRow = {
  id: string
  name: string
  owner: string
  status: string
}

const rows: SmokeRow[] = [
  { id: '1', name: 'Smoke workspace', owner: 'Smoke app', status: 'active' },
  { id: '2', name: 'Consumer import check', owner: 'Build step', status: 'ready' },
]

const columns = [
  { key: 'name', header: 'Workspace', render: (row: SmokeRow) => row.name },
  { key: 'owner', header: 'Owner', render: (row: SmokeRow) => row.owner },
  { key: 'status', header: 'Status', render: (row: SmokeRow) => row.status },
]

export function App() {
  const [query, setQuery] = React.useState('')

  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <IngradientThemeProvider>
      <IngradientGlobalStyle />
      <AppShell style={{ minHeight: '100vh' }}>
        <PageHeader>
          <PageHeaderRow>
            <PageTitleBlock>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <BrandMark size={28} />
                <PageTitle>Smoke Consumer</PageTitle>
              </div>
              <PageSubtitle>
                This app consumes only public exports from <code>@ingradient/ui</code> and verifies package build compatibility.
              </PageSubtitle>
            </PageTitleBlock>
            <Button variant="accent">Consumer build OK</Button>
          </PageHeaderRow>
        </PageHeader>

        <PageContent>
          <Alert $tone="info">
            This view validates root exports, subpath exports, styled-components theming, and <code>@ingradient/ui/tokens.css</code>.
          </Alert>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)',
              gap: spacingScale[7],
              minWidth: 0,
            }}
          >
            <Panel>
              <PanelHeader>
                <PanelTitle>Consumer table</PanelTitle>
                <PanelHint>{filteredRows.length} rows rendered from package exports</PanelHint>
              </PanelHeader>
              <Toolbar>
                <SearchField
                  placeholder="Filter smoke rows"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery('')}
                />
              </Toolbar>
              <div style={{ padding: 20 }}>
                <Table columns={columns} rows={filteredRows} />
              </div>
            </Panel>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacingScale[7] }}>
              <div className="smoke-css-proof">
                <strong>CSS export proof</strong>
                Local app CSS imports <code>@ingradient/ui/tokens.css</code> and uses token variables without reaching into source files.
              </div>

              <Panel>
                <PanelHeader>
                  <PanelTitle>Component export proof</PanelTitle>
                  <PanelHint>buttons, alert, tag-list</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Button variant="solid">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="accent">Accent</Button>
                  </div>
                  <TagList
                    items={[
                      { id: 'smoke', label: 'smoke', color: '#4d88ff', count: 2 },
                      { id: 'consumer', label: 'consumer', color: '#35c6a7', count: 1 },
                    ]}
                  />
                </div>
              </Panel>
            </div>
          </div>
        </PageContent>
      </AppShell>
    </IngradientThemeProvider>
  )
}
