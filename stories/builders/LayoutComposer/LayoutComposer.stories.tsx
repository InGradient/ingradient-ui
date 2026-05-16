import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { Button, TextField } from '@ingradient/ui/components'
import { Box, Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { copyToClipboard, downloadFile } from '../../support/download'
import { deleteDraft, listDrafts, saveDraft, type Draft } from '../../support/drafts'

const DRAFTS_SCOPE = 'layout-composer'

type PrimitiveKind = 'Stack' | 'Inline' | 'Grid' | 'Box'

type ComposerArgs = {
  primitive: PrimitiveKind
  gap: number
  padding: number
  align: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  columns: number
  childCount: number
}

const sampleStyle: React.CSSProperties = {
  padding: 'var(--ig-space-3) var(--ig-space-4)',
  background: 'var(--ig-color-surface-interactive)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-md)',
  color: 'var(--ig-color-text-primary)',
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

function buildSnippet(args: ComposerArgs) {
  const { primitive, gap, align, justify, columns, childCount } = args
  const propsByKind: Record<PrimitiveKind, string> = {
    Stack: `gap={${gap}} align="${align}" justify="${justify}"`,
    Inline: `gap={${gap}} align="${align}" justify="${justify}"`,
    Grid: `gap={${gap}} columns="repeat(${columns}, 1fr)"`,
    Box: `padding={${args.padding}}`,
  }
  const opener = `<${primitive} ${propsByKind[primitive]}>`
  const items = Array.from({ length: childCount }, (_, i) => `  <Item>${i + 1}</Item>`).join('\n')
  return `${opener}\n${items}\n</${primitive}>`
}

type LayoutComposerProps = ComposerArgs & {
  onLoadDraftArgs?: (next: Partial<ComposerArgs>) => void
}

function LayoutComposer({ onLoadDraftArgs = () => undefined, ...args }: LayoutComposerProps) {
  const children = Array.from({ length: args.childCount }, (_, i) => (
    <div key={i} style={sampleStyle}>Item {i + 1}</div>
  ))

  let preview: React.ReactNode
  if (args.primitive === 'Stack') {
    preview = <Stack gap={args.gap} align={args.align} justify={args.justify}>{children}</Stack>
  } else if (args.primitive === 'Inline') {
    preview = <Inline gap={args.gap} align={args.align} justify={args.justify}>{children}</Inline>
  } else if (args.primitive === 'Grid') {
    preview = <Grid gap={args.gap} columns={`repeat(${args.columns}, 1fr)`}>{children}</Grid>
  } else {
    preview = <Box padding={args.padding}>{children}</Box>
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
    downloadFile(`${args.primitive}.tsx`, snippet, 'text/typescript')
    flash(`Downloaded ${args.primitive}.tsx`)
  }
  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet)
    flash(ok ? 'Copied snippet to clipboard' : 'Clipboard copy failed')
  }
  const handleSaveDraft = () => {
    const name = draftName.trim() || args.primitive
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
      <div style={{ padding: 'var(--ig-space-6)', background: 'var(--ig-color-surface-panel)', border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-lg)', minHeight: 200 }}>
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
          <TextField placeholder="Draft name (e.g. 3-col-cards)" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
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
                    {d.args.primitive} · {new Date(d.savedAt).toLocaleString()}
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

const meta = {
  title: 'Builders/LayoutComposer',
  component: LayoutComposer,
  render: (args: ComposerArgs) => {
    const [, updateArgs] = useArgs<ComposerArgs>()
    return <LayoutComposer {...args} onLoadDraftArgs={updateArgs} />
  },
  parameters: { layout: 'padded' },
  argTypes: {
    primitive: { control: 'select', options: ['Stack', 'Inline', 'Grid', 'Box'] satisfies PrimitiveKind[] },
    gap: { control: { type: 'range', min: 0, max: 12, step: 1 } },
    padding: { control: { type: 'range', min: 0, max: 12, step: 1 }, if: { arg: 'primitive', eq: 'Box' } },
    align: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch'], if: { arg: 'primitive', neq: 'Box' } },
    justify: { control: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], if: { arg: 'primitive', neq: 'Box' } },
    columns: { control: { type: 'range', min: 1, max: 6, step: 1 }, if: { arg: 'primitive', eq: 'Grid' } },
    childCount: { control: { type: 'range', min: 1, max: 12, step: 1 } },
  },
  args: {
    primitive: 'Stack',
    gap: 4,
    padding: 4,
    align: 'stretch',
    justify: 'flex-start',
    columns: 3,
    childCount: 4,
  },
} satisfies Meta<ComposerArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GridThreeColumns: Story = {
  args: { primitive: 'Grid', columns: 3, childCount: 9, gap: 3 },
}

export const InlineCentered: Story = {
  args: { primitive: 'Inline', align: 'center', justify: 'center', gap: 5, childCount: 3 },
}
