import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ColorSwatch, EmptyState, SectionPanel, TextField } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { mockClasses } from '../../../fixtures/medical/0.0.1'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'medical',
  version: '0.0.1',
  page: 'ClassWorkspace',
  referenceStory: 'Pages / Medical / 0.0.1 / ClassWorkspace / Default',
  preset: 'medical-0.0.1',
  fixturesPath: 'stories/fixtures/medical/0.0.1/cases.ts (mockClasses)',
  requiredScenarios: ['default', 'drafting', 'empty'],
  interactions: [
    '클래스 row 표시 — color swatch + label + annotation count',
    '하단 input 에 새 클래스 이름 입력 → Add 버튼 활성화',
    'Add 클릭 시 list 에 append',
  ],
  platformIntegration: [
    'replace mock classes with /api/labels query (per case)',
    'Add 액션은 createLabel mutation',
    'color 는 자동 할당 또는 사용자 picker',
    'annotation count 는 server-side aggregation',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 'var(--ig-font-weight-semibold)',
  margin: 0,
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--ig-space-4) var(--ig-space-5)',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-md)',
  color: 'var(--ig-color-text-primary)',
  fontWeight: 'var(--ig-font-weight-medium)',
}

const countStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  fontFamily: 'var(--ig-font-mono)',
}

const addRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: 'var(--ig-space-3)',
  padding: 'var(--ig-space-4) var(--ig-space-5)',
}

type Scene = {
  empty?: boolean
  drafting?: boolean
}

function ClassWorkspaceScene({ empty = false, drafting = false }: Scene) {
  return (
    <div style={pageStyle}>
      <Stack gap={6}>
        <Inline justify="space-between" align="center">
          <h1 style={titleStyle}>Label classes</h1>
        </Inline>

        <SectionPanel>
          {empty ? (
            <EmptyState
              title="아직 클래스가 없습니다"
              description="첫 라벨 클래스를 만들어 라벨링을 시작하세요."
            />
          ) : (
            <Stack gap={0}>
              {mockClasses.map((cls) => (
                <div key={cls.id} style={rowStyle}>
                  <Inline gap={3} align="center">
                    <ColorSwatch $color={cls.color} $size="md" $shape="circle" />
                    <span style={labelStyle}>{cls.label}</span>
                  </Inline>
                  <span style={countStyle}>{cls.count.toLocaleString()} annotations</span>
                </div>
              ))}
              <div style={addRowStyle}>
                <TextField placeholder="New class name…" value={drafting ? 'Hemorrhage' : ''} readOnly />
                <Button variant="accent" disabled={!drafting}>Add</Button>
              </div>
            </Stack>
          )}
        </SectionPanel>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Medical/0.0.1/ClassWorkspace',
  component: ClassWorkspaceScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof ClassWorkspaceScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { empty: false, drafting: false } }
export const Drafting: Story = { args: { empty: false, drafting: true } }
export const Empty: Story = { args: { empty: true } }
