import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { PreviewPatternLabel } from '@ingradient/edge-pages'
import { Inline, Stack } from '@ingradient/ui'
import { defineHandoff } from '../../../support/handoff'
import { LogPanel, RightPanel } from './workspace/build-panels'
import { SetupContent } from './workspace/build-setup-content'
import { SIMULATION_LOGS } from './workspace/capture-fixtures'

function Controls({ mode = 'logs' }: { mode?: 'logs' | 'setup' }): JSX.Element {
  const [pattern, setPattern] = useState<PreviewPatternLabel | null>(null)
  return <Inline align="stretch" gap="var(--ig-space-4)" style={{ height: '100vh', padding: 'var(--ig-space-4)' }}>
    {mode === 'logs' ? <Stack style={{ width: 'var(--ig-popup-sm)' }}><LogPanel logs={SIMULATION_LOGS} /></Stack> : <>
      <Stack style={{ flex: 1, overflow: 'auto' }}><SetupContent previewPatternLabel={pattern} onPreviewPattern={setPattern} /></Stack>
      <Stack style={{ width: 'var(--ig-popup-sm)' }}><RightPanel previewPatternLabel={pattern} onPreviewPattern={setPattern} /><output aria-label="Selected simulation pattern">{pattern ?? 'None'}</output></Stack>
    </>}
  </Inline>
}
const meta = {
  title: 'Pages/Edge/0.0.5/CaptureControls', component: Controls,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, ...defineHandoff({ service: 'edge', version: '0.0.5', page: 'CaptureControls', preset: 'edge-0.0.1', referenceStory: 'Pages / Edge / 0.0.5 / Workspace / Setup', fixturesPath: 'stories/pages/edge/0.0.5/workspace/capture-fixtures.ts', requiredScenarios: ['logs', 'setup'], interactions: ['Log filter and keyboard detail, synthetic image modal, setup simulation'], platformIntegration: ['No equipment commands or persisted saves'] }) },
} satisfies Meta<typeof Controls>
export default meta
type Story = StoryObj<typeof meta>

export const LogFilterKeyboardImageWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const row = canvas.getByRole('button', { name: /Capture saved/ })
    row.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('region', { name: 'Logs detail' })).toHaveFocus()
    const enlarge = canvas.getByRole('button', { name: 'Enlarge capture image' })
    await userEvent.click(enlarge)
    await expect(body.getByRole('dialog', { name: 'Capture enlarged' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(enlarge).toHaveFocus()
    await userEvent.click(canvas.getByRole('button', { name: 'Close log detail' }))
    await userEvent.click(canvas.getByRole('button', { name: /Filter/ }))
    const checks = canvas.getAllByRole('checkbox')
    for (const check of checks) await userEvent.click(check.closest('label') ?? canvasElement.querySelector(`label[for="${check.id}"]`)!)
    await expect(canvas.getByRole('button', { name: /Broadcasting/ })).toBeVisible()
    await expect(canvas.getByRole('button', { name: /Connection established/ })).toBeVisible()
    await expect(canvas.getByRole('button', { name: /DEBUG/ })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    row.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('button', { name: /Broadcasting/ })).toHaveFocus()
  },
}
export const SetupSimulationWorkflow: Story = {
  args: { mode: 'setup' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const gamma = canvas.getByRole('spinbutton', { name: 'Gamma' })
    await userEvent.clear(gamma)
    await userEvent.type(gamma, '3')
    await expect(canvas.getByText(/Simulation · 256px window.*gamma 3/)).toBeVisible()
    const enlarge = canvas.getByRole('button', { name: 'Click to enlarge' })
    await userEvent.click(enlarge)
    await expect(body.getByRole('dialog', { name: /gamma 3/ })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(enlarge).toHaveFocus()
    const solidButtons = canvas.getAllByRole('button', { name: 'Solid' })
    await userEvent.click(solidButtons[0])
    for (const button of solidButtons) await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByLabelText('Selected simulation pattern')).toHaveTextContent('solid')
    await userEvent.click(solidButtons[1])
    await expect(canvas.getByLabelText('Selected simulation pattern')).toHaveTextContent('None')
    await userEvent.click(canvas.getByRole('button', { name: 'Measure' }))
    await expect(canvas.getByText(/not physically measured/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Auto Calibrate' }))
    await expect(canvas.getByText(/no camera command sent/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
    await expect(canvas.getByText(/saved in this story only/)).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await expect(gamma).toHaveValue(2.2)
    await expect(canvas.getByText(/defaults restored/)).toBeVisible()
  },
}
