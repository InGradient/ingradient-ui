import { expect, userEvent, within } from 'storybook/test'
import type { CreateProjectStoryArgs } from './create-project-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = {
  args: CreateProjectStoryArgs
  canvas: Canvas
  canvasElement: HTMLElement
  step: Step
}

export async function playProjectCreation({ args, canvas, canvasElement, step }: PlayContext) {
  await step('Correct the invalid project details', async () => {
    await expect(canvas.getByText('Project name is required.')).toBeVisible()
    await userEvent.type(canvas.getByLabelText('Project name'), 'Inspection line C')
    await userEvent.clear(canvas.getByLabelText(/Description/))
    await userEvent.type(
      canvas.getByLabelText(/Description/),
      'Photometric inspection workspace.',
    )
    await userEvent.type(canvas.getByLabelText(/First dataset name/), 'Initial capture')
    await expect(args.onNameChange).toHaveBeenLastCalledWith('Inspection line C')
    await expect(args.onDescriptionChange).toHaveBeenLastCalledWith(
      'Photometric inspection workspace.',
    )
    await expect(args.onFirstDatasetNameChange).toHaveBeenLastCalledWith('Initial capture')
    await expect(canvas.getByLabelText(/Description/)).toHaveValue(
      'Photometric inspection workspace.',
    )
    await expect(canvas.getByLabelText(/First dataset name/)).toHaveValue('Initial capture')
    await expect(canvas.queryByText('Project name is required.')).not.toBeInTheDocument()
  })

  await step('Choose a project type and add an initial image', async () => {
    const projectType = canvas.getByRole('button', { name: /Photometric Stereo Project/ })
    await userEvent.click(projectType)
    await expect(projectType).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onProjectTypeChange).toHaveBeenLastCalledWith('photometric_stereo')

    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')
    if (!input) throw new Error('Expected the Create Project file input')
    const image = new File(['image'], 'inspection-001.jpg', { type: 'image/jpeg' })
    await userEvent.upload(input, image)
    await expect(args.onFilesAdd).toHaveBeenLastCalledWith(['inspection-001.jpg'])
    await expect(canvas.getByText(/inspection-001\.jpg/)).toBeVisible()
  })

  await step('Submit the corrected project form', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create Project' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  })
}

export async function playProjectCancel({ args, canvas, step }: PlayContext) {
  await step('Cancel the prepared project', async () => {
    await expect(canvas.getByLabelText('Project name')).toHaveValue('Wafer line A Q2 2026')
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
    await expect(args.onCancel).toHaveBeenCalledOnce()
  })
}
