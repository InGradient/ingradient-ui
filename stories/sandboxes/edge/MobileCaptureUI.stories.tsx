import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, StatusPill, type StatusTone } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { mockDevices } from '../../fixtures/edge/0.0.1'
import { defineSandbox } from '../../support/sandbox'

const sandbox = defineSandbox({
  service: 'edge',
  experimentGoal: 'Edge 의 device picker 를 모바일 viewport 에 맞는 horizontal-scroll list 로 변형',
  hypothesis: '데스크탑 그리드 → 모바일 가로 스와이프 카드. tap → 즉시 capture 진입.',
  basis: 'Pages/Edge/DatasetSelect (connected devices section)',
  promotionTarget: 'pages/edge/0.1.0/MobileCapture (신규)',
  promotionCriteria: [
    '375px (Mobile viewport) 에서 card 전체 가시',
    'horizontal scroll snap 동작',
    'tap target ≥ 44×44',
    'a11y - 화면 낭독 시 device 순서 명확',
    'orientation 변경 시 layout 적응',
    'capture 진입 후 retreat 동선 (back button 위치)',
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

const scrollRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--ig-space-4)',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  paddingBottom: 'var(--ig-space-3)',
}

const cardWrap: React.CSSProperties = {
  minWidth: 280,
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}

const cardBody: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
  minHeight: 200,
}

const captionStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
}

const statusTone: Record<string, StatusTone> = {
  online: 'completed',
  capturing: 'running',
  offline: 'failed',
}

function MobileCaptureScene() {
  return (
    <div style={pageStyle}>
      <Stack gap={5}>
        <Stack gap={1}>
          <h1 style={titleStyle}>Capture</h1>
          <span style={captionStyle}>Swipe to select device</span>
        </Stack>
        <div style={scrollRowStyle}>
          {mockDevices.map((d) => (
            <div key={d.id} style={cardWrap}>
              <Card>
                <div style={cardBody}>
                  <Inline justify="space-between" align="center">
                    <span style={{ fontWeight: 600 }}>{d.name}</span>
                    <StatusPill tone={statusTone[d.status]}>{d.status}</StatusPill>
                  </Inline>
                  <span style={captionStyle}>Last seen {d.lastSeenAt}</span>
                  <div style={{ flex: 1 }} />
                  <Button variant="accent" size="lg" disabled={d.status === 'offline'}>
                    {d.status === 'capturing' ? 'Stop' : 'Start capture'}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Sandboxes/Edge/MobileCaptureUI',
  component: MobileCaptureScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile' }, ...sandbox },
} satisfies Meta<typeof MobileCaptureScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
