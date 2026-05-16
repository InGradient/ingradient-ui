import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { Button, EmptyState, Spinner, TextField } from '@ingradient/ui/components'
import { Panel, PanelHeader, PanelTitle } from '@ingradient/ui/patterns'
import { DashboardGrid, InspectorLayout, ListDetailLayout, SplitLayout } from '@ingradient/ui/patterns'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { copyToClipboard, downloadFile } from '../../support/download'
import { deleteDraft, listDrafts, saveDraft, type Draft } from '../../support/drafts'

const DRAFTS_SCOPE = 'page-composer'

type PatternKind = 'SplitLayout' | 'ListDetailLayout' | 'InspectorLayout' | 'DashboardGrid'
type SlotKind = 'panel' | 'empty-state' | 'spinner' | 'placeholder'

type ComposerArgs = {
  pattern: PatternKind
  slot1: SlotKind
  slot2: SlotKind
  slot3: SlotKind
  widgetCount: number
}

const placeholderStyle: React.CSSProperties = {
  padding: 'var(--ig-space-6)',
  background: 'var(--ig-color-surface-muted)',
  border: '1px dashed var(--ig-color-border-strong)',
  borderRadius: 'var(--ig-radius-md)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-sm)',
  textAlign: 'center',
}

const codeStyle: React.CSSProperties = {
  marginTop: 'var(--ig-space-6)',
  padding: 'var(--ig-space-4)',
  background: 'var(--ig-color-surface-muted)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-md)',
  fontFamily: 'var(--ig-font-mono)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-secondary)',
  whiteSpace: 'pre',
  overflow: 'auto',
}

function renderSlot(kind: SlotKind, label: string): React.ReactNode {
  switch (kind) {
    case 'panel':
      return (
        <Panel>
          <PanelHeader>
            <PanelTitle>{label}</PanelTitle>
          </PanelHeader>
          <div style={{ padding: 'var(--ig-space-6)', color: 'var(--ig-color-text-secondary)' }}>
            Panel body content.
          </div>
        </Panel>
      )
    case 'empty-state':
      return <EmptyState title={`No ${label.toLowerCase()}`} description="실제 콘텐츠가 들어갈 자리." />
    case 'spinner':
      return (
        <div style={{ ...placeholderStyle, padding: 'var(--ig-space-10)' }}>
          <Spinner size="lg" />
        </div>
      )
    case 'placeholder':
    default:
      return <div style={placeholderStyle}>{label}</div>
  }
}

function buildSnippet(args: ComposerArgs) {
  switch (args.pattern) {
    case 'SplitLayout':
      return `<SplitLayout\n  sidebar={<Slot1 />}\n  content={<Slot2 />}\n  inspector={<Slot3 />}\n/>`
    case 'DashboardGrid':
      return `<DashboardGrid>\n${Array.from({ length: args.widgetCount }, (_, i) => `  <Widget${i + 1} />`).join('\n')}\n</DashboardGrid>`
    case 'ListDetailLayout':
      return `<ListDetailLayout>\n  <List />\n  <Detail />\n</ListDetailLayout>`
    case 'InspectorLayout':
    default:
      return `<InspectorLayout>\n  <Main />\n  <Inspector />\n</InspectorLayout>`
  }
}

type PageComposerProps = ComposerArgs & {
  onLoadDraftArgs?: (next: Partial<ComposerArgs>) => void
}

function PageComposer({ onLoadDraftArgs = () => undefined, ...args }: PageComposerProps) {
  let preview: React.ReactNode
  switch (args.pattern) {
    case 'SplitLayout':
      preview = (
        <SplitLayout
          sidebar={renderSlot(args.slot1, 'Sidebar')}
          content={renderSlot(args.slot2, 'Content')}
          inspector={renderSlot(args.slot3, 'Inspector')}
        />
      )
      break
    case 'DashboardGrid':
      preview = (
        <DashboardGrid>
          {Array.from({ length: args.widgetCount }, (_, i) => (
            <div key={i}>{renderSlot(args.slot1, `Widget ${i + 1}`)}</div>
          ))}
        </DashboardGrid>
      )
      break
    case 'ListDetailLayout':
      preview = (
        <ListDetailLayout>
          {renderSlot(args.slot1, 'List')}
          {renderSlot(args.slot2, 'Detail')}
        </ListDetailLayout>
      )
      break
    case 'InspectorLayout':
    default:
      preview = (
        <InspectorLayout>
          {renderSlot(args.slot1, 'Main')}
          {renderSlot(args.slot2, 'Inspector')}
        </InspectorLayout>
      )
      break
  }

  const snippet = buildSnippet(args)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [drafts, setDrafts] = useState<Draft<ComposerArgs>[]>(() => listDrafts<ComposerArgs>(DRAFTS_SCOPE))
  const refreshDrafts = () => setDrafts(listDrafts<ComposerArgs>(DRAFTS_SCOPE))

  const flash = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 2400)
  }
  const handleDownload = () => {
    downloadFile(`${args.pattern}.tsx`, snippet, 'text/typescript')
    flash(`Downloaded ${args.pattern}.tsx`)
  }
  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet)
    flash(ok ? 'Copied snippet to clipboard' : 'Clipboard copy failed')
  }
  const handleSaveDraft = () => {
    const name = draftName.trim() || args.pattern
    saveDraft(DRAFTS_SCOPE, name, args)
    refreshDrafts()
    setDraftName('')
    flash(`Saved draft "${name}"`)
  }
  const handleLoadDraft = (draft: Draft<ComposerArgs>) => {
    onLoadDraftArgs(draft.args)
    flash(`Loaded "${draft.name}"`)
  }
  const handleDeleteDraft = (name: string) => {
    deleteDraft(DRAFTS_SCOPE, name)
    refreshDrafts()
    flash(`Deleted "${name}"`)
  }

  return (
    <div>
      <div style={{ padding: 'var(--ig-space-6)', background: 'var(--ig-color-surface-panel)', border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-lg)', minHeight: 240 }}>
        {preview}
      </div>
      <pre style={codeStyle}>{snippet}</pre>
      <Inline gap={3} style={{ marginTop: 'var(--ig-space-4)' }}>
        <Button variant="accent" size="sm" onClick={handleDownload}>Download TSX</Button>
        <Button variant="secondary" size="sm" onClick={handleCopy}>Copy snippet</Button>
        {feedback ? <span style={{ ...codeStyle, marginTop: 0, padding: 'var(--ig-space-2) var(--ig-space-3)' }}>{feedback}</span> : null}
      </Inline>

      <Stack gap={3} style={{ marginTop: 'var(--ig-space-6)' }}>
        <h3 style={{ fontSize: 'var(--ig-font-size-md)', fontWeight: 600, color: 'var(--ig-color-text-secondary)', margin: 0 }}>Drafts (localStorage)</h3>
        <Inline gap={3} align="center">
          <TextField placeholder="Draft name (e.g. catalog-with-inspector)" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
          <Button variant="accent" size="sm" onClick={handleSaveDraft}>Save as draft</Button>
        </Inline>
        {drafts.length === 0 ? (
          <span style={{ fontFamily: 'var(--ig-font-mono)', fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>(no drafts saved yet)</span>
        ) : (
          <Stack gap={2}>
            {drafts.map((d) => (
              <Inline key={d.name} gap={3} justify="space-between" align="center">
                <Stack gap={0}>
                  <span style={{ fontWeight: 600 }}>{d.name}</span>
                  <span style={{ fontFamily: 'var(--ig-font-mono)', fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                    {d.args.pattern} · {new Date(d.savedAt).toLocaleString()}
                  </span>
                </Stack>
                <Inline gap={2}>
                  <Button variant="secondary" size="sm" onClick={() => handleLoadDraft(d)}>Load</Button>
                  <Button variant="secondary" size="sm" tone="danger" onClick={() => handleDeleteDraft(d.name)}>Delete</Button>
                </Inline>
              </Inline>
            ))}
          </Stack>
        )}
      </Stack>
    </div>
  )
}

const slotOptions: SlotKind[] = ['panel', 'empty-state', 'spinner', 'placeholder']

const meta = {
  title: 'Builders/PageComposer',
  component: PageComposer,
  render: (args: ComposerArgs) => {
    const [, updateArgs] = useArgs<ComposerArgs>()
    return <PageComposer {...args} onLoadDraftArgs={updateArgs} />
  },
  parameters: { layout: 'fullscreen' },
  argTypes: {
    pattern: { control: 'select', options: ['SplitLayout', 'ListDetailLayout', 'InspectorLayout', 'DashboardGrid'] satisfies PatternKind[] },
    slot1: { control: 'select', options: slotOptions, name: 'Slot 1' },
    slot2: { control: 'select', options: slotOptions, name: 'Slot 2', if: { arg: 'pattern', neq: 'DashboardGrid' } },
    slot3: { control: 'select', options: slotOptions, name: 'Slot 3 (Inspector)', if: { arg: 'pattern', eq: 'SplitLayout' } },
    widgetCount: { control: { type: 'range', min: 1, max: 9, step: 1 }, if: { arg: 'pattern', eq: 'DashboardGrid' } },
  },
  args: {
    pattern: 'ListDetailLayout',
    slot1: 'panel',
    slot2: 'panel',
    slot3: 'placeholder',
    widgetCount: 6,
  },
} satisfies Meta<ComposerArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SplitWithInspector: Story = {
  args: { pattern: 'SplitLayout', slot1: 'panel', slot2: 'panel', slot3: 'panel' },
}

export const Dashboard6Widgets: Story = {
  args: { pattern: 'DashboardGrid', slot1: 'panel', widgetCount: 6 },
}

export const EmptyStates: Story = {
  args: { pattern: 'ListDetailLayout', slot1: 'empty-state', slot2: 'empty-state' },
}
