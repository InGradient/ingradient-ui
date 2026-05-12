import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Grid, Inline, Stack } from '@ingradient/ui/primitives'

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

function LayoutComposer(args: ComposerArgs) {
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

  return (
    <div>
      <div style={{ padding: 'var(--ig-space-6)', background: 'var(--ig-color-surface-panel)', border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-lg)', minHeight: 200 }}>
        {preview}
      </div>
      <pre style={codeStyle}>{buildSnippet(args)}</pre>
    </div>
  )
}

const meta = {
  title: 'Builders/LayoutComposer',
  component: LayoutComposer,
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
} satisfies Meta<typeof LayoutComposer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GridThreeColumns: Story = {
  args: { primitive: 'Grid', columns: 3, childCount: 9, gap: 3 },
}

export const InlineCentered: Story = {
  args: { primitive: 'Inline', align: 'center', justify: 'center', gap: 5, childCount: 3 },
}
