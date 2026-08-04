import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { ClassManageStoryArgs } from './class-manage-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = {
  args: ClassManageStoryArgs
  canvas: Canvas
  canvasElement: HTMLElement
  step: Step
}

export async function playSidebarCollapse({ args, canvas, step }: PlayContext) {
  await step('Expand the collapsed class sidebar', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Expand class sidebar' }))
    await expect(args.onSidebarChange).toHaveBeenLastCalledWith(false)
    await expect(canvas.getByRole('complementary', { name: 'Classes' })).toBeVisible()
  })

  await step('Collapse the sidebar and restore the documented state', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }))
    await expect(args.onSidebarChange).toHaveBeenLastCalledWith(true)
    await expect(canvas.getByRole('button', { name: 'Expand class sidebar' })).toBeVisible()
  })
}

export async function playClassSelection({ args, canvas, canvasElement, step }: PlayContext) {
  await step('Start without a selected class', async () => {
    expect(canvasElement.querySelectorAll('[data-class-id][aria-current="true"]')).toHaveLength(0)
    await expect(
      canvas.getByText('Select a class to see linked datasets and images.'),
    ).toBeVisible()
  })

  await step('Select Crack and populate the workspace', async () => {
    await userEvent.click(canvas.getByRole('button', { name: /^Crack/ }))
    await expect(args.onClassSelectionChange).toHaveBeenLastCalledWith('cl-1')
    await expect(canvas.getByRole('textbox', { name: 'Class name' })).toHaveValue('Crack')
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-grid-id]')).toHaveLength(9)
    })
  })
}

export async function playDatasetSelection({ args, canvas, canvasElement, step }: PlayContext) {
  const dataset = canvas.getByRole('button', { name: /Wafer line A/ })

  await step('Exclude one linked dataset', async () => {
    await expect(dataset).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(dataset)
    await expect(args.onDatasetSelectionChange).toHaveBeenLastCalledWith('ds-1', false)
    await expect(dataset).toHaveAttribute('aria-pressed', 'false')
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-grid-id]')).toHaveLength(6)
    })
  })

  await step('Restore all linked datasets', async () => {
    await userEvent.click(dataset)
    await expect(args.onDatasetSelectionChange).toHaveBeenLastCalledWith('ds-1', true)
    await waitFor(() => {
      expect(canvasElement.querySelectorAll('[data-grid-id]')).toHaveLength(9)
    })
  })
}

export async function playImageReview({ args, canvas, canvasElement, step }: PlayContext) {
  const body = within(document.body)
  const imageCell = canvasElement.querySelector<HTMLElement>('[data-grid-id="img-cl1-2"]')
  if (!imageCell) throw new Error('Expected image img-cl1-2 in the Class Management grid')
  const referenceImage = canvas.getByAltText('Reference image')
  const initialReferenceUrl = referenceImage.getAttribute('src')

  await step('Open and close the selected image', async () => {
    await userEvent.click(imageCell)
    await expect(args.onImageAction).toHaveBeenLastCalledWith('open', 'img-cl1-2')
    await expect(await body.findByRole('dialog', { name: 'wafer-batch-002.jpg' })).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Close' }))
    await expect(args.onImageAction).toHaveBeenLastCalledWith('close', 'img-cl1-2')
  })

  await step('Assign the image as the class reference', async () => {
    await userEvent.pointer({ target: imageCell, keys: '[MouseRight]' })
    await expect(args.onImageAction).toHaveBeenLastCalledWith(
      'open-context-menu',
      'img-cl1-2',
    )
    await userEvent.click(await body.findByRole('menuitem', { name: 'Add to Reference Image' }))
    await expect(args.onReferenceImageAction).toHaveBeenLastCalledWith(
      'assign-from-context-menu',
      'img-cl1-2',
      undefined,
    )
    await waitFor(() => {
      expect(referenceImage.getAttribute('src')).not.toBe(initialReferenceUrl)
    })
  })
}

export async function playReferenceBbox({ args, canvas, step }: PlayContext) {
  await step('Choose the next reference bounding box', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next bbox' }))
    await expect(args.onReferenceImageAction).toHaveBeenLastCalledWith(
      'select-bbox',
      'img-cl1-1',
      1,
    )
  })

  await step('Return to the first bounding box', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Previous bbox' }))
    await expect(args.onReferenceImageAction).toHaveBeenLastCalledWith(
      'select-bbox',
      'img-cl1-1',
      0,
    )
  })
}

export async function playAddClass({ args, canvas, step }: PlayContext) {
  await step('Name and confirm a new class', async () => {
    const input = canvas.getByRole('textbox', { name: 'Add Class' })
    await userEvent.type(input, 'Story defect')
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }))
    await expect(args.onDialogAction).toHaveBeenLastCalledWith('add-class', 'confirm')
    await expect(args.onClassAction).toHaveBeenLastCalledWith('add', expect.any(String))
  })

  await step('Show the created class as the current selection', async () => {
    await expect(canvas.getByRole('button', { name: /^Story defect/ })).toBeVisible()
    await expect(canvas.getByRole('textbox', { name: 'Class name' })).toHaveValue(
      'Story defect',
    )
    await expect(canvas.queryByRole('dialog', { name: 'Add Class' })).not.toBeInTheDocument()
  })
}

export async function playClassActions({ args, canvas, step }: PlayContext) {
  const body = within(document.body)

  await step('Duplicate the selected class', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu for Crack' }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Duplicate' }))
    await expect(args.onClassAction).toHaveBeenLastCalledWith('duplicate', 'cl-1')
    await expect(canvas.getByRole('button', { name: /^Crack Copy/ })).toBeVisible()
  })

  await step('Request deletion and cancel once', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu for Crack Copy' }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Delete' }))
    await expect(await body.findByRole('dialog', { name: 'Delete this class?' })).toBeVisible()
    await userEvent.click(body.getByRole('button', { name: 'Cancel' }))
    await expect(args.onDialogAction).toHaveBeenLastCalledWith('delete-class', 'cancel')
    await expect(canvas.getByRole('button', { name: /^Crack Copy/ })).toBeVisible()
  })

  await step('Confirm deletion of the duplicate', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu for Crack Copy' }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Delete' }))
    const dialog = await body.findByRole('dialog', { name: 'Delete this class?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete' }))
    await expect(args.onClassAction).toHaveBeenLastCalledWith('delete', 'cl-1-copy')
    await expect(canvas.queryByRole('button', { name: /^Crack Copy/ })).not.toBeInTheDocument()
  })
}

export async function playPatternSequence({ step }: PlayContext) {
  const body = within(document.body)

  await step('Switch from the black pattern to the solid image', async () => {
    await userEvent.click(body.getByRole('tab', { name: 'Solid' }))
    await expect(body.getByRole('dialog', { name: 'seq-solid.jpg' })).toBeVisible()
    await expect(body.getByAltText('seq-solid.jpg')).toBeVisible()
  })

  await step('Switch to an indexed phase pattern', async () => {
    await userEvent.click(body.getByRole('tab', { name: 'X 1/3' }))
    await expect(body.getByRole('dialog', { name: 'seq-x-0.jpg' })).toBeVisible()
    await expect(body.getByAltText('seq-x-0.jpg')).toBeVisible()
  })
}

export async function playCocoMapping({ args, canvas, step }: PlayContext) {
  const body = within(document.body)

  await step('Map the class to the COCO person category', async () => {
    await userEvent.click(canvas.getByRole('button', { name: '— Not mapped —' }))
    await userEvent.click(await body.findByRole('option', { name: 'person' }))
    await expect(args.onMappingChange).toHaveBeenLastCalledWith('person')
    await expect(canvas.getByRole('button', { name: 'person' })).toBeVisible()
  })
}
