import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Card, EmptyState, SectionPanel, StatusPill, type StatusTone } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { mockDatasets, mockDevices } from '../../../fixtures/edge/0.0.1'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'DatasetSelect',
  referenceStory: 'Pages / Edge / 0.0.1 / DatasetSelect / WithDatasets',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/devices.ts',
  requiredScenarios: ['with-datasets', 'empty'],
  interactions: [
    'device card 클릭 → 캡처 화면 진입',
    'dataset card 클릭 → 해당 dataset 의 라벨링 화면',
    'device status 변경 시 status pill 실시간 업데이트',
  ],
  platformIntegration: [
    'replace mock devices with Electron device discovery (USB/IP camera scan)',
    'dataset 은 local SQLite + 동기화된 cloud dataset 의 union',
    'status (online/offline/capturing) 는 device 와의 heartbeat 결과',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--ig-space-7)',
  background: 'var(--ig-color-bg-canvas)',
}

const headerStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 600,
  margin: 0,
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-lg)',
  fontWeight: 600,
  margin: '0 0 var(--ig-space-4)',
  color: 'var(--ig-color-text-secondary)',
}

const cardBodyStyle: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-md)',
  fontWeight: 600,
  color: 'var(--ig-color-text-primary)',
}

const metaStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
}

const deviceTone: Record<string, StatusTone> = {
  online: 'completed',
  capturing: 'running',
  offline: 'failed',
}

type Scene = {
  showDatasets?: boolean
}

function DatasetSelectScene({ showDatasets = true }: Scene) {
  return (
    <div style={pageStyle}>
      <Stack gap={7}>
        <Inline justify="space-between" align="center">
          <h1 style={headerStyle}>Edge Workstation</h1>
          <Badge $tone="accent">Online</Badge>
        </Inline>

        <SectionPanel>
          <h2 style={sectionTitleStyle}>Connected devices</h2>
          <Grid gap={3} columns="repeat(2, minmax(0, 1fr))">
            {mockDevices.map((d) => (
              <Card key={d.id}>
                <div style={cardBodyStyle}>
                  <Inline justify="space-between" align="center">
                    <span style={titleStyle}>{d.name}</span>
                    <StatusPill tone={deviceTone[d.status]}>{d.status}</StatusPill>
                  </Inline>
                  <span style={metaStyle}>Last seen {d.lastSeenAt}</span>
                </div>
              </Card>
            ))}
          </Grid>
        </SectionPanel>

        <SectionPanel>
          <h2 style={sectionTitleStyle}>Recent datasets</h2>
          {showDatasets ? (
            <Grid gap={3} columns="repeat(3, minmax(0, 1fr))">
              {mockDatasets.map((ds) => (
                <Card key={ds.id}>
                  <div style={cardBodyStyle}>
                    <span style={titleStyle}>{ds.name}</span>
                    <span style={metaStyle}>{ds.imageCount.toLocaleString()} images</span>
                    <span style={metaStyle}>Captured {ds.lastCapturedAt}</span>
                  </div>
                </Card>
              ))}
            </Grid>
          ) : (
            <EmptyState title="아직 데이터셋이 없음" description="라이선스가 활성화된 후 첫 캡처를 시작하세요." />
          )}
        </SectionPanel>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/DatasetSelect',
  component: DatasetSelectScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof DatasetSelectScene>

export default meta

type Story = StoryObj<typeof meta>

export const WithDatasets: Story = { args: { showDatasets: true } }
export const Empty: Story = { args: { showDatasets: false } }
