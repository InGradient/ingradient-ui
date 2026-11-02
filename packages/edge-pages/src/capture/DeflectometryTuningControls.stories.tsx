// Deflectometry tuning controls: shown in the right panel while a derived view is active.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DeflectometryTuningControlsView } from './DeflectometryTuningControlsView'
import type { ColormapName, DerivedKind } from './colormap-helpers'
import type { DeflectometryTuningControlsLabels, TuningQualityMetrics } from './types'

const LABELS: DeflectometryTuningControlsLabels = {
  title: 'Tuning',
  reset: 'Reset',
  analyze: 'Analyze',
  analyzing: 'Analyzing…',
  saveDefault: 'Save as default',
  saveDefaultSaving: 'Saving…',
  modulationThreshold: 'Modulation threshold',
  modulationOverlay: 'Show overlay',
  colormapSection: 'Colormap',
  confidence: 'Confidence',
  computing: 'Computing…',
  validRatio: 'Valid pixels',
  warnLowConfidence: 'Low confidence: check exposure and focus.',
}

const METRICS: TuningQualityMetrics = { validRatio: 0.82, confidenceStatus: 'good', warnings: [] }

function Scene({ initialExpanded = true, kind = 'gradient' as DerivedKind | null }): JSX.Element {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [threshold, setThreshold] = useState(0.12)
  const [overlay, setOverlay] = useState(true)
  const [colormaps, setColormaps] = useState<Record<DerivedKind, ColormapName>>({ gradient: 'turbo', modulation: 'grayscale' })
  return (
    <div style={{ width: 'var(--ig-popup-sm)', padding: 'var(--ig-spacing-16)' }}>
      <DeflectometryTuningControlsView
        disabled={false}
        expanded={expanded}
        activeDerivedKind={kind}
        modulationThreshold={threshold}
        modulationOverlayEnabled={overlay}
        colormaps={colormaps}
        isRecomputing={false}
        isAutoTuning={false}
        isSavingDefault={false}
        metrics={METRICS}
        labels={LABELS}
        onToggleExpanded={() => setExpanded((value) => !value)}
        onModulationThresholdChange={setThreshold}
        onModulationOverlayChange={setOverlay}
        onColormapChange={(k, name) => setColormaps((current) => ({ ...current, [k]: name }))}
        onRecompute={() => undefined}
        onSaveDefault={() => undefined}
        onReset={() => undefined}
      />
    </div>
  )
}

const meta = {
  title: 'Components/Edge/Capture/DeflectometryTuningControls',
  component: Scene,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof Scene>

export default meta
type Story = StoryObj<typeof meta>

export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('button', { name: /Tuning/i })
    await expect(header).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByRole('slider', { name: 'modulation threshold' })).toBeInTheDocument()
    await userEvent.click(header)
    await expect(header).toHaveAttribute('aria-expanded', 'false')
  },
}

export const Collapsed: Story = { args: { initialExpanded: false } }
