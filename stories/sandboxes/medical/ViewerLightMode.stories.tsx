import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, StatusPill, type StatusTone } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { mockCases } from '../../fixtures/medical/0.0.1'
import { defineSandbox } from '../../support/sandbox'

const sandbox = defineSandbox({
  service: 'medical',
  experimentGoal: 'Medical 환경에서 menu/toolbar 는 light, viewer canvas 는 dark 인 hybrid theme 검증',
  hypothesis: 'DICOM 영상은 dark canvas 유지하면서, 외곽 UI 만 light 로 가독성 향상.',
  basis: 'Pages/Medical/ProjectPicker (case list + side panel)',
  promotionTarget: 'pages/medical/0.1.0/Workbench (hybrid mode)',
  promotionCriteria: [
    'light 영역과 dark 영역의 경계 대비 적절 (눈 피로)',
    'theme 전환 시 viewer canvas dark 유지',
    'DICOM 영상의 perceived contrast 변화 측정 (영상 의학 전문가 review)',
    'a11y - light 배경 + dark 영역 모두 contrast ratio 4.5+',
    'long session 사용 시 눈 피로도 (디자이너 자체 1시간 사용 review)',
    'medical 0.0.1 dark 모드와 동시 운영 가능성',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f4f6fb',  // light surface
  color: '#1a1f2c',
  display: 'flex',
}

const sidebarStyle: React.CSSProperties = {
  width: 280,
  background: '#ffffff',
  borderRight: '1px solid #d8dde6',
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-4)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-md)',
  fontWeight: 600,
  margin: 0,
}

const viewerStyle: React.CSSProperties = {
  flex: 1,
  background: '#000000',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}

const toolbarStyle: React.CSSProperties = {
  background: '#ffffff',
  borderBottom: '1px solid #d8dde6',
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--ig-space-3)',
}

const viewerCanvas: React.CSSProperties = {
  flex: 1,
  display: 'grid',
  placeItems: 'center',
  color: '#444',
  fontFamily: 'var(--ig-font-mono)',
}

const caseListItem = (active: boolean): React.CSSProperties => ({
  padding: 'var(--ig-space-3)',
  borderRadius: 8,
  background: active ? '#e3eaff' : 'transparent',
  border: active ? '1px solid #94aaff' : '1px solid transparent',
  fontFamily: 'var(--ig-font-mono)',
  fontSize: 'var(--ig-font-size-sm)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const statusTone: Record<string, StatusTone> = {
  pending: 'queued',
  'in-review': 'running',
  completed: 'completed',
}

function ViewerLightModeScene() {
  const cases = mockCases.slice(0, 5)
  const activeId = cases[1]?.id
  return (
    <div style={pageStyle}>
      <aside style={sidebarStyle}>
        <h2 style={titleStyle}>Cases</h2>
        <Stack gap={1}>
          {cases.map((c) => (
            <div key={c.id} style={caseListItem(c.id === activeId)}>
              <span>{c.patientLabel}</span>
              <StatusPill tone={statusTone[c.status]}>{c.status}</StatusPill>
            </div>
          ))}
        </Stack>
      </aside>
      <section style={viewerStyle}>
        <div style={toolbarStyle}>
          <Inline gap={3} align="center">
            <h2 style={titleStyle}>{cases[1]?.patientLabel ?? 'No case'}</h2>
            <StatusPill tone="running">in-review</StatusPill>
          </Inline>
          <Inline gap={2}>
            <Button variant="secondary" size="sm">Zoom</Button>
            <Button variant="secondary" size="sm">Annotate</Button>
            <Button variant="accent" size="sm">Save</Button>
          </Inline>
        </div>
        <div style={viewerCanvas}>
          DICOM viewer (dark canvas — hybrid mode)
        </div>
      </section>
    </div>
  )
}

const meta = {
  title: 'Sandboxes/Medical/ViewerLightMode',
  component: ViewerLightModeScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...sandbox },
} satisfies Meta<typeof ViewerLightModeScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
