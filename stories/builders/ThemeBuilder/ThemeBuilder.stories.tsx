import React, { useLayoutEffect, useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Badge, Button, Card, StatusPill, TextField } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { composePreset, type BrandId, type DensityId, type Preset, type ThemeId } from '@ingradient/ui/tokens'
import { copyToClipboard, downloadFile, exportPresetJson, exportPresetTs } from './export-preset'

type BuilderArgs = {
  presetId: string
  theme: ThemeId
  brand: BrandId
  density: DensityId
}

function buildAdHocPreset(args: BuilderArgs): Preset {
  return {
    id: args.presetId || 'theme-builder-adhoc',
    service: 'platform',
    version: '0.0.0',
    theme: args.theme,
    brand: args.brand,
    density: args.density,
    mode: 'dark',
  }
}

const pageStyle: React.CSSProperties = {
  padding: 'var(--ig-space-7)',
  background: 'var(--ig-color-bg-canvas)',
  minHeight: '100vh',
}

const sectionTitle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-lg)',
  fontWeight: 600,
  color: 'var(--ig-color-text-secondary)',
  margin: 0,
}

const cardBody: React.CSSProperties = {
  padding: 'var(--ig-space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
}

const codeStyle: React.CSSProperties = {
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

const overrideKeyStyle: React.CSSProperties = {
  fontFamily: 'var(--ig-font-mono)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
}

function ThemeBuilder(args: BuilderArgs) {
  const preset = useMemo(() => buildAdHocPreset(args), [args])
  const composed = useMemo(() => composePreset(preset), [preset])
  const [exportFeedback, setExportFeedback] = useState<string | null>(null)

  // ad-hoc CSS vars 적용. PresetProvider (decorator) 위에 override 로 얹힘.
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    Object.entries(composed.cssVariables).forEach(([k, v]) => root.style.setProperty(k, v))
    return () => {
      Object.keys(composed.cssVariables).forEach((k) => root.style.removeProperty(k))
    }
  }, [composed])

  const overrideEntries = Object.entries(composed.cssVariables)

  const handleDownloadJson = () => {
    downloadFile(`${preset.id}.json`, exportPresetJson(preset), 'application/json')
    flashFeedback(`Downloaded ${preset.id}.json`)
  }

  const handleCopyTs = async () => {
    const ok = await copyToClipboard(exportPresetTs(preset))
    flashFeedback(ok ? 'Copied TypeScript to clipboard' : 'Clipboard copy failed — falling back to download')
    if (!ok) downloadFile(`${preset.id}.ts`, exportPresetTs(preset), 'text/typescript')
  }

  const flashFeedback = (msg: string) => {
    setExportFeedback(msg)
    setTimeout(() => setExportFeedback(null), 2400)
  }

  return (
    <div style={pageStyle}>
      <Stack gap={7}>
        <h1 style={{ fontSize: 'var(--ig-font-size-2xl)', fontWeight: 600, margin: 0 }}>ThemeBuilder</h1>

        <Stack gap={4}>
          <h2 style={sectionTitle}>Preview — Buttons</h2>
          <Inline gap={3}>
            <Button variant="accent">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="solid">Solid</Button>
            <Button tone="danger">Danger</Button>
          </Inline>
        </Stack>

        <Stack gap={4}>
          <h2 style={sectionTitle}>Preview — Form</h2>
          <Grid gap={3} columns="repeat(3, minmax(0, 1fr))">
            <TextField placeholder="Small" size="sm" />
            <TextField placeholder="Medium" size="md" />
            <TextField placeholder="Large" size="lg" />
          </Grid>
        </Stack>

        <Stack gap={4}>
          <h2 style={sectionTitle}>Preview — Cards & Status</h2>
          <Grid gap={3} columns="repeat(3, minmax(0, 1fr))">
            <Card>
              <div style={cardBody}>
                <span style={{ fontWeight: 600 }}>Project A</span>
                <Inline gap={2}>
                  <Badge $tone="accent">accent</Badge>
                  <StatusPill tone="completed">completed</StatusPill>
                </Inline>
              </div>
            </Card>
            <Card>
              <div style={cardBody}>
                <span style={{ fontWeight: 600 }}>Project B</span>
                <Inline gap={2}>
                  <Badge $tone="success">success</Badge>
                  <StatusPill tone="running">running</StatusPill>
                </Inline>
              </div>
            </Card>
            <Card>
              <div style={cardBody}>
                <span style={{ fontWeight: 600 }}>Project C</span>
                <Inline gap={2}>
                  <Badge $tone="danger">danger</Badge>
                  <StatusPill tone="failed">failed</StatusPill>
                </Inline>
              </div>
            </Card>
          </Grid>
        </Stack>

        <Stack gap={4}>
          <h2 style={sectionTitle}>Preview — Alerts</h2>
          <Alert $tone="info">Info alert — preview text.</Alert>
          <Alert $tone="warning">Warning alert — preview text.</Alert>
          <Alert $tone="danger">Danger alert — preview text.</Alert>
        </Stack>

        <Stack gap={3}>
          <h2 style={sectionTitle}>Applied CSS variables ({overrideEntries.length})</h2>
          {overrideEntries.length === 0 ? (
            <span style={overrideKeyStyle}>(no override — current preset is identity)</span>
          ) : (
            <Stack gap={1}>
              {overrideEntries.map(([k, v]) => (
                <Inline key={k} gap={3} justify="space-between">
                  <span style={overrideKeyStyle}>{k}</span>
                  <span style={{ ...overrideKeyStyle, color: 'var(--ig-color-text-primary)' }}>{v}</span>
                </Inline>
              ))}
            </Stack>
          )}
        </Stack>

        <Stack gap={3}>
          <h2 style={sectionTitle}>Preset snippet</h2>
          <pre style={codeStyle}>{exportPresetTs(preset)}</pre>
        </Stack>

        <Stack gap={3}>
          <h2 style={sectionTitle}>Export</h2>
          <Inline gap={3}>
            <Button variant="accent" onClick={handleDownloadJson}>Download JSON</Button>
            <Button variant="secondary" onClick={handleCopyTs}>Copy TypeScript</Button>
          </Inline>
          {exportFeedback ? <span style={overrideKeyStyle}>{exportFeedback}</span> : null}
        </Stack>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Builders/ThemeBuilder',
  component: ThemeBuilder,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    presetId: { control: 'text', description: 'Export 파일명/식별자' },
    theme: { control: 'select', options: ['industrial-dark', 'medical-dark'] satisfies ThemeId[] },
    brand: { control: 'select', options: ['default', 'finemtech', 'samsung'] satisfies BrandId[] },
    density: { control: 'select', options: ['comfortable', 'compact', 'ultra-dense'] satisfies DensityId[] },
  },
  args: {
    presetId: 'platform-custom-0.0.0',
    theme: 'industrial-dark',
    brand: 'default',
    density: 'compact',
  },
} satisfies Meta<typeof ThemeBuilder>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FinemtechCompact: Story = {
  args: { theme: 'industrial-dark', brand: 'finemtech', density: 'compact' },
}

export const SamsungComfortable: Story = {
  args: { theme: 'industrial-dark', brand: 'samsung', density: 'comfortable' },
}

export const MedicalDark: Story = {
  args: { theme: 'medical-dark', brand: 'default', density: 'comfortable' },
}

export const UltraDense: Story = {
  args: { theme: 'industrial-dark', brand: 'default', density: 'ultra-dense' },
}
