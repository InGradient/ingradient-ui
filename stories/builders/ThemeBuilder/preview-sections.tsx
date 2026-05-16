import React from 'react'
import { Alert, Badge, Button, Card, StatusPill, TextField } from '@ingradient/ui/components'
import { Grid, Inline, Stack } from '@ingradient/ui/primitives'
import { cardBody, sectionTitle } from './styles'

const SPACING_KEYS = Array.from({ length: 14 }, (_, i) => i)
const RADIUS_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'pill'] as const
const FONT_SIZE_KEYS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const
const SHADOW_KEYS = ['panel', 'floating', 'popover', 'hover-lift', 'focus-ring'] as const

const swatchStyle: React.CSSProperties = {
  background: 'var(--ig-color-accent)',
  height: 24,
  borderRadius: 'var(--ig-radius-sm)',
}

const radiusBoxStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  background: 'var(--ig-color-surface-panel)',
  border: '1px solid var(--ig-color-border-strong)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
  fontFamily: 'var(--ig-font-mono)',
}

const shadowBoxStyle: React.CSSProperties = {
  width: 140,
  height: 80,
  background: 'var(--ig-color-surface-panel)',
  borderRadius: 'var(--ig-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-secondary)',
  fontFamily: 'var(--ig-font-mono)',
}

export function PreviewSections() {
  return (
    <>
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
          {[
            { name: 'Project A', tone: 'accent' as const, status: 'completed' as const },
            { name: 'Project B', tone: 'success' as const, status: 'running' as const },
            { name: 'Project C', tone: 'danger' as const, status: 'failed' as const },
          ].map((p) => (
            <Card key={p.name}>
              <div style={cardBody}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <Inline gap={2}>
                  <Badge $tone={p.tone}>{p.tone}</Badge>
                  <StatusPill tone={p.status}>{p.status}</StatusPill>
                </Inline>
              </div>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Stack gap={4}>
        <h2 style={sectionTitle}>Preview — Alerts</h2>
        <Alert $tone="info">Info alert — preview text.</Alert>
        <Alert $tone="warning">Warning alert — preview text.</Alert>
        <Alert $tone="danger">Danger alert — preview text.</Alert>
      </Stack>

      <Stack gap={4}>
        <h2 style={sectionTitle}>Preview — Spacing</h2>
        <Stack gap={2}>
          {SPACING_KEYS.map((i) => (
            <Inline key={i} gap={3} align="center">
              <span style={{ width: 80, fontFamily: 'var(--ig-font-mono)', fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>space {i}</span>
              <div style={{ ...swatchStyle, width: `var(--ig-space-${i})` }} />
            </Inline>
          ))}
        </Stack>
      </Stack>

      <Stack gap={4}>
        <h2 style={sectionTitle}>Preview — Radius</h2>
        <Inline gap={3} style={{ flexWrap: 'wrap' }}>
          {RADIUS_KEYS.map((k) => (
            <div key={k} style={{ ...radiusBoxStyle, borderRadius: `var(--ig-radius-${k})` }}>{k}</div>
          ))}
        </Inline>
      </Stack>

      <Stack gap={4}>
        <h2 style={sectionTitle}>Preview — Typography</h2>
        <Stack gap={2}>
          {FONT_SIZE_KEYS.map((k) => (
            <span key={k} style={{ fontSize: `var(--ig-font-size-${k})`, color: 'var(--ig-color-text-primary)' }}>
              Font {k} — The quick brown fox jumps over the lazy dog
            </span>
          ))}
        </Stack>
      </Stack>

      <Stack gap={4}>
        <h2 style={sectionTitle}>Preview — Shadow</h2>
        <Inline gap={4} style={{ padding: 'var(--ig-space-5)', flexWrap: 'wrap' }}>
          {SHADOW_KEYS.map((k) => (
            <div key={k} style={{ ...shadowBoxStyle, boxShadow: `var(--ig-shadow-${k})` }}>{k}</div>
          ))}
        </Inline>
      </Stack>
    </>
  )
}
