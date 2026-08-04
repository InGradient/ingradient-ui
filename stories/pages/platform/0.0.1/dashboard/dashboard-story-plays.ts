import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { DashboardStoryArgs } from './dashboard-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = {
  args: DashboardStoryArgs
  canvas: Canvas
  canvasElement: HTMLElement
  step: Step
}

function widgetRowSizes(canvasElement: HTMLElement) {
  const widgets = [...canvasElement.querySelectorAll<HTMLElement>('[data-widget-key]')]
  const rows = [...new Set(widgets.map((widget) => widget.parentElement).filter(Boolean))]
  return rows.map((row) => row!.querySelectorAll(':scope > [data-widget-key]').length)
}

function settleInitialEffects() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

async function clickCheckbox(input: HTMLElement) {
  const label = input.closest('label')
  if (!label) throw new Error('Expected Dashboard checkbox to be wrapped by a label')
  await userEvent.click(label)
}

export async function playDashboardCustomize({ args, canvas, canvasElement, step }: PlayContext) {
  const subsetLabels = [
    'Labeling Status',
    'Class Ratio',
    'Pending vs Processed',
    'Dataset Distribution',
  ]
  const remainingLabels = [
    'Data Collection',
    'Images Over Time',
    'Labeling by Person',
    'Defects by Source',
  ]

  await step('Open Customize and create a focused widget subset', async () => {
    await expect(canvasElement.querySelectorAll('[data-widget-key]')).toHaveLength(8)
    await userEvent.click(canvas.getByRole('button', { name: 'Customize' }))
    await expect(args.onCustomizeToggle).toHaveBeenLastCalledWith(true)
    await expect(canvas.getByRole('group', { name: 'Visible Sections' })).toBeVisible()

    for (const label of subsetLabels) {
      await clickCheckbox(canvas.getByRole('checkbox', { name: label }))
    }
    await expect(args.onWidgetVisibilityChange).toHaveBeenCalledWith(
      'show_dataset_distribution',
      false,
    )
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-widget-key]')).toHaveLength(4)
    })
  })

  await step('Reach and recover from the all-hidden state', async () => {
    for (const label of remainingLabels) {
      await clickCheckbox(canvas.getByRole('checkbox', { name: label }))
    }
    await expect(canvas.getByText('All widgets hidden. Enable some via Customize.')).toBeVisible()

    await clickCheckbox(canvas.getByRole('checkbox', { name: 'Data Collection' }))
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-widget-key]')).toHaveLength(1)
    })
    await expect(args.onWidgetVisibilityChange).toHaveBeenLastCalledWith(
      'show_data_collection',
      true,
    )
  })
}

export async function playDashboardDateRange({ args, canvas, step }: PlayContext) {
  await step('Apply a date preset', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'All time' }))
    await expect(args.onDateRangeToggle).toHaveBeenLastCalledWith(true)
    const dialog = canvas.getByRole('dialog', { name: 'Overview Date Range' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Last 7 days' }))
    await expect(args.onDateDraftChange).toHaveBeenCalled()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Apply' }))
    await expect(args.onDateApply).toHaveBeenCalledWith(
      '2026-05-08',
      '2026-05-14',
    )
    await expect(canvas.queryByRole('dialog', { name: 'Overview Date Range' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: '2026-05-08 → 2026-05-14' })).toBeVisible()
  })

  await step('Reset the applied date range', async () => {
    await userEvent.click(canvas.getByRole('button', { name: '2026-05-08 → 2026-05-14' }))
    const dialog = canvas.getByRole('dialog', { name: 'Overview Date Range' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Reset' }))
    await expect(args.onDateReset).toHaveBeenCalledOnce()
    await expect(canvas.getByRole('button', { name: 'All time' })).toBeVisible()
  })
}

export async function playDashboardExports({ args, canvas, step }: PlayContext) {
  await step('Save the complete dashboard as PDF', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save PDF' }))
    await expect(args.onSavePdf).toHaveBeenCalledOnce()
    await expect(canvas.getByText('PDF saved.')).toBeVisible()
  })

  await step('Request an individual widget image', async () => {
    await userEvent.click(canvas.getAllByRole('button', { name: 'Download widget image' })[0])
    await expect(args.onWidgetDownload).toHaveBeenLastCalledWith('data_collection')
  })
}

export async function playDashboardLayoutReset({ args, canvas, canvasElement, step }: PlayContext) {
  await settleInitialEffects()

  await step('Reorder a widget with the keyboard drag control', async () => {
    await expect(widgetRowSizes(canvasElement)).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
    const dragHandle = canvas.getByRole('button', { name: 'Drag Images by dataset' })
    dragHandle.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(args.onLayoutChange).toHaveBeenLastCalledWith([
      ['timeline', 'data_collection'],
      ['labeling_status'],
      ['class_ratio'],
      ['labeling_by_person'],
      ['defects_by_source'],
      ['pending_processed'],
      ['dataset_distribution'],
    ])
    await waitFor(() => {
      expect(widgetRowSizes(canvasElement)).toEqual([2, 1, 1, 1, 1, 1, 1])
    })
  })

  await step('Restore the default widget layout', async () => {
    await expect(widgetRowSizes(canvasElement)).toEqual([2, 1, 1, 1, 1, 1, 1])
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await expect(args.onLayoutReset).toHaveBeenCalledOnce()
    await waitFor(() => {
      expect(widgetRowSizes(canvasElement)).toEqual([2, 3, 2, 1])
    })
  })
}
