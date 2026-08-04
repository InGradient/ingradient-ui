import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { CatalogStoryArgs } from './catalog-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = {
  args: CatalogStoryArgs
  canvas: Canvas
  canvasElement: HTMLElement
  step: Step
}

export async function playActiveFilters({ canvasElement, step }: PlayContext) {
  await step('Show only images matching all active filters', async () => {
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-image-id]')).toHaveLength(2)
    })
  })
}

export async function playMobileSort({ args, canvas, canvasElement, step }: PlayContext) {
  await step('Choose descending image-name order', async () => {
    await userEvent.click(canvas.getByRole('option', { name: 'Name (Z-A)' }))
    await expect(args.onSortChange).toHaveBeenLastCalledWith('name-desc')
    await expect(args.onMobileControlChange).toHaveBeenLastCalledWith('bottom-sheet', null)
  })

  await step('Close the sheet and render the sorted result', async () => {
    await waitFor(() => {
      expect(canvas.queryByRole('listbox', { name: 'Sort images' })).not.toBeInTheDocument()
    })
    const firstImage = canvasElement.querySelector('[data-image-id] img')
    await expect(firstImage).toHaveAttribute(
      'alt',
      'very-long-image-filename-2024-q4-batch-3-wafer-line-a-013-cropped-and-aligned.jpg',
    )
  })
}

export async function playMobileStatsFallback({ canvas, step }: PlayContext) {
  await step('Replace desktop analytics with a supported mobile image mode', async () => {
    await waitFor(() => {
      expect(canvas.queryByRole('heading', { name: 'Images by dataset' })).not.toBeInTheDocument()
    })
    await expect(canvas.getByRole('button', { name: 'View' })).toBeVisible()
  })
}

export async function playWorkspaceOverview({ args, canvas, canvasElement, step }: PlayContext) {
  await step('Search images and clear the query', async () => {
    const search = canvas.getByRole('searchbox', { name: 'Search file name' })
    await userEvent.type(search, '20230808')
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-image-id]')).toHaveLength(2)
    })
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('20230808')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('')
  })

  await step('Sort images by name', async () => {
    const body = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Sort' }))
    await userEvent.click(await body.findByRole('option', { name: 'Name (Z-A)' }))
    await expect(args.onSortChange).toHaveBeenLastCalledWith('name-desc')
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-image-id] img')).toHaveAttribute(
        'alt',
        'very-long-image-filename-2024-q4-batch-3-wafer-line-a-013-cropped-and-aligned.jpg',
      )
    })

  })

  await step('Select visible images and open the delete confirmation', async () => {
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all images' }).parentElement!)
    await expect(args.onImageSelectionChange).toHaveBeenLastCalledWith('*', true)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }))
    await expect(args.onDeleteRequested).toHaveBeenCalledOnce()

    const body = within(document.body)
    await expect(await body.findByRole('heading', { name: /Delete \d+ images/ })).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Cancel' }))
    await expect(args.onDialogAction).toHaveBeenLastCalledWith('delete-images', 'close')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all images' }).parentElement!)
  })
}

export async function playImageInspector({ canvas, step }: PlayContext) {
  await step('Render the image, metadata, and seeded comments in one modal', async () => {
    const dialog = canvas.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.querySelector('img')).toBeVisible()
    const danielMentions = canvas.getAllByText('Daniel Kim', { exact: true })
    expect(danielMentions.length).toBeGreaterThan(0)
    await expect(danielMentions.at(-1)).toBeVisible()
  })
}

export function playDialogHeading(name: string) {
  return async ({ canvas, step }: PlayContext) => {
    await step(`Open ${name}`, async () => {
      await expect(canvas.getByRole('heading', { name })).toBeVisible()
    })
  }
}
