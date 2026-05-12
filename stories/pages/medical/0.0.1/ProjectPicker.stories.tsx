import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, EmptyState, SectionPanel, StatusPill, type StatusTone } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { mockCases } from '../../../fixtures/medical/0.0.1'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'medical',
  version: '0.0.1',
  page: 'ProjectPicker',
  referenceStory: 'Pages / Medical / 0.0.1 / ProjectPicker / Default',
  preset: 'medical-0.0.1',
  fixturesPath: 'stories/fixtures/medical/0.0.1/cases.ts',
  requiredScenarios: ['default', 'empty'],
  interactions: [
    'case card 클릭 → 라벨링 화면 (Workbench)',
    'New case 클릭 → upload modal',
    'status pill 로 진행 단계 (pending/in-review/completed) 표시',
  ],
  platformIntegration: [
    'replace mock cases with /api/cases query',
    'New case 액션은 DICOM upload 시작',
    'status 는 case workflow state (서버 enum)',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 600,
  margin: 0,
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  margin: 0,
}

const caseCardBodyStyle: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-md)',
  fontWeight: 600,
  fontFamily: 'var(--ig-font-mono)',
  color: 'var(--ig-color-text-primary)',
}

const metaStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
}

const statusToneMap: Record<string, StatusTone> = {
  pending: 'queued',
  'in-review': 'running',
  completed: 'completed',
}

type Scene = {
  empty?: boolean
}

function ProjectPickerScene({ empty = false }: Scene) {
  return (
    <div style={pageStyle}>
      <Stack gap={7}>
        <Inline justify="space-between" align="center">
          <div>
            <h1 style={titleStyle}>Cases</h1>
            <p style={subtitleStyle}>최근 라벨링 대상 영상</p>
          </div>
          <Button variant="accent">New case</Button>
        </Inline>

        <SectionPanel>
          {empty ? (
            <EmptyState
              title="아직 등록된 case 가 없습니다"
              description="첫 의료 영상을 업로드하면 여기서 라벨링을 시작할 수 있습니다."
            />
          ) : (
            <Grid gap={4} columns="repeat(3, minmax(0, 1fr))">
              {mockCases.map((c) => (
                <Card key={c.id}>
                  <div style={caseCardBodyStyle}>
                    <Inline justify="space-between" align="center">
                      <span style={labelStyle}>{c.patientLabel}</span>
                      <StatusPill tone={statusToneMap[c.status]}>{c.status}</StatusPill>
                    </Inline>
                    <span style={metaStyle}>{c.modality} · {c.imageCount} images · {c.studyDate}</span>
                  </div>
                </Card>
              ))}
            </Grid>
          )}
        </SectionPanel>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Medical/0.0.1/ProjectPicker',
  component: ProjectPickerScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof ProjectPickerScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { empty: false } }
export const Empty: Story = { args: { empty: true } }
