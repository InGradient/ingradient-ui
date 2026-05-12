import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Alert, Button, ColorSwatch, EmptyState, SectionPanel, Spinner, TextField, TextareaField,
} from '@ingradient/ui/components'
import { PageContent, PageHeader, PageTitle, PageTitleBlock, Panel, PanelHeader, PanelTitle } from '@ingradient/ui/patterns'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { classScenarios, type ClassScenario, type MockClass } from '../../../fixtures/platform/0.0.1/class-scenarios'
import { scenarioArgType } from '../../../support/scenarios'
import { rightPanelArg, sidebarArg, type RightPanelState, type SidebarState } from '../../../support/page-controls'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'ClassManage',
  referenceStory: 'Pages / Platform / ClassManage / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/class-scenarios.ts',
  requiredScenarios: ['default', 'empty', 'loading', 'permission-denied', 'long-text', 'many-items'],
  interactions: [
    '클래스 row 클릭 → right panel 에 detail 표시',
    'New class 클릭 → 추가 modal',
    'name / description 편집 시 explicit save',
  ],
  platformIntegration: [
    'replace mock classes with useClasses() (frontend/store/useClassStore.ts)',
    'New class 액션은 createClass mutation',
    'permissionDenied 는 useAuth().permissions.canEditClasses',
    'color picker 는 별도 ColorSwatch input component',
  ],
})

type Args = {
  scenario: ClassScenario
  sidebar: SidebarState
  rightPanel: RightPanelState
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

const rowStyle = (selected: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ig-space-3)',
  padding: 'var(--ig-space-3) var(--ig-space-4)',
  borderRadius: 'var(--ig-radius-md)',
  background: selected ? 'var(--ig-color-surface-active)' : 'transparent',
  border: selected ? '1px solid var(--ig-color-accent-soft)' : '1px solid transparent',
  cursor: 'pointer',
})

const nameStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-primary)',
  fontWeight: 500,
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const countStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  fontFamily: 'var(--ig-font-mono)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  fontWeight: 600,
  letterSpacing: '0.04em',
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
          <Button key={item} variant={item === 'Classes' ? 'accent' : 'secondary'} size="sm">
            {state === 'expanded' ? item : item[0]}
          </Button>
        ))}
      </Stack>
    </aside>
  )
}

function ClassList({ classes, selectedId }: { classes: MockClass[]; selectedId: string | null }) {
  return (
    <Stack gap={1}>
      {classes.map((c) => (
        <div key={c.id} style={rowStyle(c.id === selectedId)}>
          <ColorSwatch $color={c.color} $size="md" $shape="circle" />
          <span style={nameStyle}>{c.name}</span>
          <span style={countStyle}>{c.imageCount.toLocaleString()}</span>
        </div>
      ))}
    </Stack>
  )
}

function ClassDetail({ cls }: { cls: MockClass }) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Class detail</PanelTitle>
      </PanelHeader>
      <div style={{ padding: 'var(--ig-space-5)' }}>
        <Stack gap={4}>
          <Inline gap={3} align="center">
            <ColorSwatch $color={cls.color} $size="md" $shape="circle" />
            <span style={{ fontSize: 'var(--ig-font-size-lg)', fontWeight: 600 }}>{cls.name}</span>
          </Inline>
          <Stack gap={2}>
            <span style={labelStyle}>Name</span>
            <TextField value={cls.name} readOnly />
          </Stack>
          <Stack gap={2}>
            <span style={labelStyle}>Description</span>
            <TextareaField value={cls.description ?? ''} readOnly placeholder="(none)" rows={3} />
          </Stack>
          <Stack gap={2}>
            <span style={labelStyle}>Statistics</span>
            <Inline justify="space-between"><span style={countStyle}>Annotations</span><span>{cls.imageCount.toLocaleString()}</span></Inline>
            <Inline justify="space-between"><span style={countStyle}>Color</span><span style={countStyle}>{cls.color}</span></Inline>
          </Stack>
        </Stack>
      </div>
    </Panel>
  )
}

function ClassManageScene(args: Args) {
  const scene = classScenarios[args.scenario]
  const selectedClass = scene.classes.find((c) => c.id === scene.selectedId)

  return (
    <div style={pageStyle}>
      <SidebarColumn state={args.sidebar} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <PageHeader>
          <PageTitleBlock>
            <PageTitle>Classes</PageTitle>
            <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>
              Manage label classes for annotating images.
            </span>
          </PageTitleBlock>
          <Button variant="accent" size="sm">New class</Button>
        </PageHeader>
        <PageContent>
          {scene.permissionDenied ? (
            <Alert $tone="warning">You don&apos;t have permission to manage classes in this project.</Alert>
          ) : scene.error ? (
            <Alert $tone="danger">{scene.error}</Alert>
          ) : scene.loading ? (
            <Stack gap={3} align="center"><Spinner size="lg" /><span style={countStyle}>Loading classes…</span></Stack>
          ) : scene.classes.length === 0 ? (
            <EmptyState title="No classes yet" description="Create your first label class to start annotating." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: args.rightPanel === 'open' ? '320px 1fr' : '1fr', gap: 'var(--ig-space-7)', minWidth: 0 }}>
              <SectionPanel>
                <ClassList classes={scene.classes} selectedId={scene.selectedId} />
              </SectionPanel>
              {args.rightPanel === 'open' && selectedClass ? <ClassDetail cls={selectedClass} /> : null}
            </div>
          )}
        </PageContent>
      </div>
    </div>
  )
}

const meta = {
  title: 'Pages/Platform/ClassManage',
  component: ClassManageScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: {
    scenario: scenarioArgType(),
    sidebar: sidebarArg,
    rightPanel: rightPanelArg,
  },
  args: { scenario: 'default', sidebar: 'expanded', rightPanel: 'open' },
} satisfies Meta<typeof ClassManageScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { scenario: 'empty' } }
export const Loading: Story = { args: { scenario: 'loading' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const LongNames: Story = { args: { scenario: 'long-text' } }
export const ManyItems: Story = { args: { scenario: 'many-items' } }
export const NoRightPanel: Story = { args: { rightPanel: 'closed' } }
