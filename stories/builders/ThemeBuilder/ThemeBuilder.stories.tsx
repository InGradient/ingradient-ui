import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { Button, TextField } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import {
  buildTokenCssVariables, composePreset,
  type BrandId, type DensityId, type Preset, type ThemeId, type ThemeMode,
} from '@ingradient/ui/tokens'
import { copyToClipboard, downloadFile, exportPresetJson, exportPresetTs } from './export-preset'
import {
  buildTokenAutoSyncUpdates, buildTokenOverrides, tokenOverrideArgTypes, tokenOverrideDefaults,
  type TokenOverrideArgs,
} from './token-overrides'
import { deleteDraft, listDrafts, saveDraft, type Draft } from '../../support/drafts'
import { codeStyle, overrideKeyStyle, pageStyle, sectionTitle } from './styles'
import { PreviewSections } from './preview-sections'

const DRAFTS_SCOPE = 'theme-builder'

type BuilderArgs = {
  presetId: string
  theme: ThemeId
  brand: BrandId
  density: DensityId
  mode: 'light' | 'dark'
  // tokenOverrideDefaults 가 채워주는 dynamic string 필드들. index signature 형태로 받음.
  [tokenKey: string]: unknown
}

function buildAdHocPreset(args: BuilderArgs): Preset {
  return {
    id: args.presetId || 'theme-builder-adhoc',
    service: 'platform',
    version: '0.0.0',
    theme: args.theme,
    brand: args.brand,
    density: args.density,
    mode: args.mode as ThemeMode,
  }
}

type ThemeBuilderProps = BuilderArgs & {
  onLoadDraftArgs?: (next: Partial<BuilderArgs>) => void
}

function ThemeBuilder({ onLoadDraftArgs = () => undefined, ...args }: ThemeBuilderProps) {
  const preset = useMemo(() => buildAdHocPreset(args), [args])
  const composed = useMemo(() => composePreset(preset), [preset])
  const tokenOverrides = useMemo(() => buildTokenOverrides(args as unknown as TokenOverrideArgs), [args])
  // global CSS 의 mode-specific tokenCssVariables + composed.cssVariables (brand/density override) = picker 가 트래킹할 resolved 값
  const resolvedDefaults = useMemo(
    () => ({ ...buildTokenCssVariables(args.mode), ...composed.cssVariables }),
    [composed, args.mode],
  )
  const appliedVars = useMemo(
    () => ({ ...composed.cssVariables, ...tokenOverrides }),
    [composed, tokenOverrides],
  )
  const [exportFeedback, setExportFeedback] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [drafts, setDrafts] = useState<Draft<BuilderArgs>[]>(() => listDrafts<BuilderArgs>(DRAFTS_SCOPE))
  const refreshDrafts = () => setDrafts(listDrafts<BuilderArgs>(DRAFTS_SCOPE))

  const flashFeedback = (msg: string) => {
    setExportFeedback(msg)
    setTimeout(() => setExportFeedback(null), 2400)
  }
  const handleSaveDraft = () => {
    const name = draftName.trim() || preset.id
    saveDraft(DRAFTS_SCOPE, name, args)
    refreshDrafts()
    setDraftName('')
    flashFeedback(`Saved draft "${name}"`)
  }
  const handleLoadDraft = (draft: Draft<BuilderArgs>) => {
    onLoadDraftArgs(draft.args)
    flashFeedback(`Loaded "${draft.name}"`)
  }
  const handleDeleteDraft = (name: string) => {
    deleteDraft(DRAFTS_SCOPE, name)
    refreshDrafts()
    flashFeedback(`Deleted "${name}"`)
  }
  const handleDownloadJson = () => {
    downloadFile(`${preset.id}.json`, exportPresetJson(preset, tokenOverrides), 'application/json')
    flashFeedback(`Downloaded ${preset.id}.json`)
  }
  const handleCopyTs = async () => {
    const code = exportPresetTs(preset, tokenOverrides)
    const ok = await copyToClipboard(code)
    flashFeedback(ok ? 'Copied TypeScript to clipboard' : 'Clipboard copy failed — falling back to download')
    if (!ok) downloadFile(`${preset.id}.ts`, code, 'text/typescript')
  }

  // theme/brand/density/mode 변경 시 — 사용자가 직접 override 안 한 picker 만 새 default 로 동기화.
  const prevDefaults = useRef<Record<string, string>>({})
  useEffect(() => {
    const updates = buildTokenAutoSyncUpdates(prevDefaults.current, resolvedDefaults, args as unknown as TokenOverrideArgs)
    prevDefaults.current = resolvedDefaults
    if (Object.keys(updates).length) onLoadDraftArgs(updates)
  }, [resolvedDefaults, args, onLoadDraftArgs])

  // ad-hoc CSS vars 적용. PresetProvider (decorator) 위에 override 로 얹힘.
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    Object.entries(appliedVars).forEach(([k, v]) => root.style.setProperty(k, v))
    return () => {
      Object.keys(appliedVars).forEach((k) => root.style.removeProperty(k))
    }
  }, [appliedVars])

  return (
    <div style={pageStyle}>
      <Stack gap={7}>
        <h1 style={{ fontSize: 'var(--ig-font-size-2xl)', fontWeight: 'var(--ig-font-weight-semibold)', margin: 0 }}>ThemeBuilder</h1>
        <PreviewSections />

        <Stack gap={3}>
          <h2 style={sectionTitle}>Preset snippet</h2>
          <pre style={codeStyle}>{exportPresetTs(preset, tokenOverrides)}</pre>
        </Stack>

        <Stack gap={3}>
          <h2 style={sectionTitle}>Export</h2>
          <Inline gap={3}>
            <Button variant="accent" onClick={handleDownloadJson}>Download JSON</Button>
            <Button variant="secondary" onClick={handleCopyTs}>Copy TypeScript</Button>
          </Inline>
          {exportFeedback ? <span style={overrideKeyStyle}>{exportFeedback}</span> : null}
        </Stack>

        <Stack gap={3}>
          <h2 style={sectionTitle}>Drafts (localStorage)</h2>
          <Inline gap={3} align="center">
            <TextField
              placeholder="Draft name (e.g. wafer-line-a)"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
            <Button variant="accent" onClick={handleSaveDraft}>Save as draft</Button>
          </Inline>
          {drafts.length === 0 ? (
            <span style={overrideKeyStyle}>(no drafts saved yet)</span>
          ) : (
            <Stack gap={2}>
              {drafts.map((d) => (
                <Inline key={d.name} gap={3} justify="space-between" align="center">
                  <Stack gap={0}>
                    <span style={{ fontWeight: 'var(--ig-font-weight-semibold)' }}>{d.name}</span>
                    <span style={overrideKeyStyle}>
                      {d.args.theme} · {d.args.brand} · {d.args.density} · {d.args.mode} · {new Date(d.savedAt).toLocaleString()}
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
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Builders/ThemeBuilder',
  component: ThemeBuilder,
  render: (args: BuilderArgs) => {
    const [, updateArgs] = useArgs<BuilderArgs>()
    return <ThemeBuilder {...args} onLoadDraftArgs={updateArgs} />
  },
  parameters: {
    layout: 'fullscreen',
    // 상단 toolbar 의 global mode / density 가 이 story 에 영향 안 가도록 ThemeBuilder argType 단일화.
    globals: { mode: 'inherit', density: 'inherit' },
  },
  argTypes: {
    presetId: { control: 'text', description: 'Export 파일명/식별자', table: { category: 'Preset' } },
    theme: { control: 'select', options: ['industrial-dark', 'medical-dark'] satisfies ThemeId[], table: { category: 'Preset' } },
    brand: { control: 'select', options: ['default', 'finemtech', 'samsung'] satisfies BrandId[], table: { category: 'Preset' } },
    density: { control: 'select', options: ['comfortable', 'compact', 'ultra-dense'] satisfies DensityId[], table: { category: 'Preset' } },
    mode: { control: 'select', options: ['light', 'dark'], table: { category: 'Preset' } },
    ...tokenOverrideArgTypes,
  },
  args: {
    presetId: 'platform-custom-0.0.0',
    theme: 'industrial-dark',
    brand: 'default',
    density: 'compact',
    mode: 'dark',
    ...tokenOverrideDefaults,
  },
} satisfies Meta<BuilderArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FinemtechCompact: Story = { args: { theme: 'industrial-dark', brand: 'finemtech', density: 'compact' } }
export const SamsungComfortable: Story = { args: { theme: 'industrial-dark', brand: 'samsung', density: 'comfortable' } }
export const MedicalDark: Story = { args: { theme: 'medical-dark', brand: 'default', density: 'comfortable' } }
export const UltraDense: Story = { args: { theme: 'industrial-dark', brand: 'default', density: 'ultra-dense' } }
export const LightMode: Story = { args: { mode: 'light' } }
