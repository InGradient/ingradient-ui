import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, SectionPanel, StatusPill, type StatusTone } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { catalogScenarios, type MockDataset } from '../../fixtures/platform/0.0.1/catalog-scenarios'
import { defineSandbox } from '../../support/sandbox'

const sandbox = defineSandbox({
  service: 'platform',
  experimentGoal: 'Catalog 에서 ultra-dense density 의 정보 표시량 검증',
  hypothesis: '한 화면에 dataset row 30+ 개 표시 가능. 가독성 vs 정보 밀도 trade-off 확인.',
  basis: 'Pages/Platform/Catalog (default scenario)',
  promotionTarget: 'pages/platform/0.1.0/Catalog (ultra-dense density 옵션)',
  promotionCriteria: [
    'ultra-dense density 에서 row 30+ 개 정상 렌더',
    'long-name dataset 의 truncate 동작 검증',
    'a11y - 24px 이하 row 에서도 키보드 접근 가능',
    'mobile viewport 에서 density fallback 동작',
    'pages/platform/Catalog 의 viewMode=table 패턴과 호환',
    'StatusPill 의 dense 변형 필요 여부 결정',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--ig-color-bg-canvas)',
  padding: 'var(--ig-space-5)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xl)',
  fontWeight: 600,
  margin: 0,
}

const denseRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px 1fr 80px 100px 80px',
  gap: 'var(--ig-space-3)',
  padding: 'var(--ig-space-1) var(--ig-space-3)',
  alignItems: 'center',
  fontSize: 'var(--ig-font-size-xs)',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const denseHeaderStyle: React.CSSProperties = {
  ...denseRowStyle,
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const nameStyle: React.CSSProperties = {
  color: 'var(--ig-color-text-primary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const metaStyle: React.CSSProperties = {
  color: 'var(--ig-color-text-muted)',
  fontFamily: 'var(--ig-font-mono)',
}

const statusTone: Record<MockDataset['status'], StatusTone> = {
  ready: 'completed',
  syncing: 'running',
  failed: 'failed',
}

// many-items + huge 데이터를 합쳐 30+ rows 시뮬레이션
const manyDatasets: MockDataset[] = [
  ...catalogScenarios['many-items'].datasets,
  ...catalogScenarios['huge-dataset'].datasets,
].slice(0, 30)

function DenseCatalogScene() {
  return (
    <div style={pageStyle}>
      <Stack gap={4}>
        <Inline justify="space-between" align="center">
          <h1 style={titleStyle}>Catalog (ultra-dense experiment)</h1>
          <span style={metaStyle}>{manyDatasets.length} rows</span>
        </Inline>
        <SectionPanel>
          <Card>
            <div style={denseHeaderStyle}>
              <span />
              <span>Name</span>
              <span>Images</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {manyDatasets.map((d) => (
              <div key={d.id} style={denseRowStyle}>
                <input type="checkbox" readOnly />
                <span style={nameStyle}>{d.name}</span>
                <span style={metaStyle}>{d.imageCount.toLocaleString()}</span>
                <StatusPill tone={statusTone[d.status]}>{d.status}</StatusPill>
                <span style={metaStyle}>{d.lastUpdatedAt}</span>
              </div>
            ))}
          </Card>
        </SectionPanel>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Sandboxes/Platform/DenseCatalog',
  component: DenseCatalogScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...sandbox },
} satisfies Meta<typeof DenseCatalogScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
