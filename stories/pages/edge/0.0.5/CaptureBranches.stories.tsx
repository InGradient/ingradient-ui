import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import { PANEL_CLASSES } from '../../../fixtures/edge/0.0.5'
import { defineHandoff } from '../../../support/handoff'
import { CaptureBranches } from './workspace/capture-branches'

const meta = {
  title: 'Pages/Edge/0.0.5/CaptureBranches', component: CaptureBranches,
  args: { onMockAction: fn() },
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, ...defineHandoff({ service: 'edge', version: '0.0.5', page: 'CaptureBranches', preset: 'edge-0.0.1', referenceStory: 'Pages / Edge / 0.0.5 / Workspace / Capture', fixturesPath: 'stories/pages/edge/0.0.5/workspace/capture-fixtures.ts', requiredScenarios: ['review', 'derived', 'labeling', 'collapsed', 'roi', 'comment'], interactions: ['Synthetic capture review and labeling; no equipment integration'], platformIntegration: ['Existing edge canvas and workspace labeling shell contracts'] }) },
} satisfies Meta<typeof CaptureBranches>
export default meta
type Story = StoryObj<typeof meta>

export const ReviewSaveWorkflow: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Skip simulated capture' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('capture skipped')
    await userEvent.click(canvas.getByRole('button', { name: 'Save simulated capture' }))
    await expect(canvas.getByRole('button', { name: 'Save labels' })).toBeEnabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Save labels' }))
    await expect(canvas.getByRole('button', { name: 'Review capture' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel simulated label save' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Save labels' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Complete simulated label save' }))
    await expect(args.onMockAction).toHaveBeenCalledWith('1 labels saved locally')
  },
}
export const DerivedRetryWorkflow: Story = {
  args: { initialBranch: 'derived' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Derived' }))
    await expect(canvas.getByRole('button', { name: 'Gradient X' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Calculate synthetic derived view' }))
    await expect(canvas.getByRole('button', { name: 'Calculating simulation' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Fail simulated calculation' }))
    await expect(canvas.getByText('Simulation: calculation failed; retry is available')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Calculate synthetic derived view' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Complete simulated calculation' }))
    await expect(canvas.queryByRole('button', { name: 'Calculate synthetic derived view' })).not.toBeInTheDocument()
  },
}
export const DerivedUnavailable: Story = { args: { initialBranch: 'derived', initialDerivedState: 'unavailable' }, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('button', { name: 'Calculate synthetic derived view' })).toBeDisabled() } }
export const LabelingResetWorkflow: Story = {
  args: { initialBranch: 'labeling' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Draw boxes' }))
    await expect(canvas.getByRole('button', { name: 'Draw boxes' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Hide annotations' }))
    await expect(canvas.getByRole('button', { name: 'Show annotations' })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Reset boxes' }))
    await expect(canvas.getByRole('button', { name: 'Save labels' })).toBeDisabled()
    await expect(canvas.getByLabelText('Label count')).toHaveTextContent('0 labels')
  },
}
export const CanvasEditSelectionZoomWorkflow: Story = {
  args: { initialBranch: 'labeling' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = canvas.getByAltText('Capture for labeling') as HTMLImageElement
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
    const area = image.parentElement!
    const surface = area.lastElementChild as HTMLElement
    // Toolbar clicks may scroll the document. Read geometry after each click,
    // and wait for the rendered drag preview before releasing the pointer.
    const point = (x: number, y: number) => {
      const rect = surface.getBoundingClientRect()
      return { clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * y }
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Draw boxes' }))
    const pointer = userEvent.setup()
    await pointer.pointer({ target: surface, coords: point(0.65, 0.65), keys: '[MouseLeft>]' })
    await pointer.pointer({ target: surface, coords: point(0.9, 0.9) })
    await waitFor(() => expect(area.querySelector('rect[stroke-dasharray]')).not.toBeNull())
    await pointer.pointer({ target: surface, coords: point(0.9, 0.9), keys: '[/MouseLeft]' })
    await waitFor(() => expect(canvas.getByLabelText('Label count')).toHaveTextContent('2 labels'))
    await userEvent.click(canvas.getByRole('button', { name: 'Select boxes' }))
    await fireEvent.mouseDown(surface, { ...point(0.75, 0.75), button: 0 })
    await fireEvent.mouseUp(surface, point(0.75, 0.75))
    await expect(canvas.getByLabelText('Selected box')).toHaveTextContent('Box 2')
    await userEvent.click(canvas.getByRole('button', { name: PANEL_CLASSES[1].class_name }))
    await expect(canvas.getByLabelText('Selected box')).toHaveTextContent(PANEL_CLASSES[1].class_id)
    const zoomWrap = area.parentElement!
    const originalTransform = getComputedStyle(zoomWrap).transform
    await fireEvent.wheel(surface, { deltaY: -120, ctrlKey: true })
    await waitFor(() => expect(getComputedStyle(zoomWrap).transform).not.toBe(originalTransform))
  },
}

export const CollapsedRoiCommentWorkflow: Story = {
  args: { initialBranch: 'labeling', initiallyCollapsed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Expand class panel' }))
    const roi = canvas.getByRole('button', { name: /ROI/ })
    await userEvent.click(roi)
    await expect(roi).toHaveAttribute('aria-pressed', 'true')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Comments' }), 'Synthetic review comment')
    await userEvent.click(canvas.getByRole('button', { name: 'Send comment' }))
    await expect(canvas.getByText('Synthetic review comment')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Send comment' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse class panel' }))
    await expect(canvas.getByRole('button', { name: 'Expand class panel' })).toBeVisible()
  },
}
