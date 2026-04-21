import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState, ProgressBar, StatCard, Table, type TableColumn } from '../../src/components'
import { DashboardGrid, Panel, PanelHeader, PanelHint, PanelTitle } from '../../src/patterns'
import { StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

type QueueRow = {
  id: string
  name: string
  owner: string
  state: string
}

const metrics = [
  { label: 'Active queues', value: '12', hint: '+2 today' },
  { label: 'Assigned reviews', value: '184', hint: '74 due today' },
  { label: 'Approval rate', value: '97.2%', hint: 'last 7 days' },
]

const tableColumns: TableColumn<QueueRow>[] = [
  { key: 'name', header: 'Queue', render: (row) => row.name },
  { key: 'owner', header: 'Owner', render: (row) => row.owner },
  { key: 'state', header: 'State', render: (row) => row.state },
]

const realisticRows: QueueRow[] = [
  { id: '1', name: 'North America defects', owner: 'J. Kim', state: 'Ready' },
  { id: '2', name: 'Supplier audit backlog', owner: 'M. Park', state: 'Reviewing' },
  { id: '3', name: 'April export regression', owner: 'S. Choi', state: 'Blocked' },
]

const overloadedRows: QueueRow[] = [
  ...realisticRows,
  { id: '4', name: 'Operations shadow queue', owner: 'D. Lee', state: 'Queued' },
  { id: '5', name: 'Pilot reruns', owner: 'A. Han', state: 'Ready' },
  { id: '6', name: 'Escalated labels', owner: 'K. Seo', state: 'Reviewing' },
]

const meta = {
  title: 'Patterns/Dashboard Grid',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function MetricPanel({
  title,
  value,
  hint,
}: {
  title: string
  value: string
  hint: string
}) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        <PanelHint>{hint}</PanelHint>
      </PanelHeader>
      <div style={{ padding: 20, fontSize: 'var(--ig-font-size-2xl)', fontWeight: 700 }}>{value}</div>
    </Panel>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Dashboard Grid"
      description="DashboardGrid owns widget rhythm, not widget logic. Review sparse, realistic, and overloaded mixes here so summary pages do not drift into product-specific spacing rules."
    >
      <StorybookSection
        title="Density variations"
        description="The same grid should support lightweight overview cards, mixed summary panels, and denser operational boards."
      >
        <StorybookStack gap={20}>
          <div>
            <div style={{ marginBottom: 12, fontWeight: 700 }}>Sparse overview</div>
            <DashboardGrid>
              <MetricPanel title="Queue health" value="Healthy" hint="No blocked jobs" />
              <MetricPanel title="Weekly throughput" value="2,418" hint="+8.4%" />
              <Panel>
                <PanelHeader>
                  <PanelTitle>Empty slot</PanelTitle>
                  <PanelHint>placeholder panel</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20 }}>
                  <EmptyState title="Add a widget" description="Sparse dashboards should keep empty space intentional rather than stretching one card awkwardly." />
                </div>
              </Panel>
            </DashboardGrid>
          </div>

          <div>
            <div style={{ marginBottom: 12, fontWeight: 700 }}>Realistic operational mix</div>
            <DashboardGrid>
              {metrics.map((metric) => (
                <StatCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />
              ))}
              <Panel>
                <PanelHeader>
                  <PanelTitle>Completion trend</PanelTitle>
                  <PanelHint>Current release</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20 }}>
                  <ProgressBar value={72} />
                </div>
              </Panel>
              <Panel>
                <PanelHeader>
                  <PanelTitle>Queues</PanelTitle>
                  <PanelHint>3 active</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20 }}>
                  <Table columns={tableColumns} rows={realisticRows} />
                </div>
              </Panel>
            </DashboardGrid>
          </div>

          <div>
            <div style={{ marginBottom: 12, fontWeight: 700 }}>Overloaded board</div>
            <DashboardGrid>
              {metrics.map((metric) => (
                <StatCard key={`${metric.label}-dense`} label={metric.label} value={metric.value} hint={metric.hint} />
              ))}
              <Panel>
                <PanelHeader>
                  <PanelTitle>Queue summary</PanelTitle>
                  <PanelHint>6 active</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20 }}>
                  <Table columns={tableColumns} rows={overloadedRows} />
                </div>
              </Panel>
              <Panel>
                <PanelHeader>
                  <PanelTitle>Risk watch</PanelTitle>
                  <PanelHint>Escalation</PanelHint>
                </PanelHeader>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <ProgressBar value={48} />
                  <ProgressBar value={63} />
                  <ProgressBar value={89} />
                </div>
              </Panel>
            </DashboardGrid>
          </div>
        </StorybookStack>
      </StorybookSection>
    </StorybookPage>
  ),
}
