import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { WorkspaceScene } from './workspace/workspace-scene'
import { defineHandoff } from '../../../support/handoff'

const meta = {
  title: 'Pages/Edge/0.0.5/ImagesWorkflows',
  component: WorkspaceScene,
  args: { activeTab: 'images' },
  parameters: {
    layout: 'fullscreen', a11y: { test: 'error' },
    ...defineHandoff({ service: 'edge', version: '0.0.5', page: 'ImagesWorkflows', preset: 'edge-0.0.1',
      referenceStory: 'Pages / Edge / 0.0.5 / Workspace / Images', fixturesPath: 'stories/fixtures/edge/0.0.5/temp-images.ts',
      requiredScenarios: ['selection-delete', 'group-delete', 'filter-date', 'inspector'],
      interactions: ['Controlled synthetic image selection, date filtering, confirmation and inspector navigation'],
      platformIntegration: ['No deletion, labeling persistence, camera or backend operations. Fixed preview clock: 20 May 2026.'],
    }),
  },
} satisfies Meta<typeof WorkspaceScene>
export default meta
type Story = StoryObj<typeof meta>

export const SelectionDeleteWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByText('Select all', { exact: true }))
    await expect(page.getByRole('checkbox', { name: 'Select all' })).toBeChecked()
    await userEvent.click(page.getByRole('button', { name: 'Delete (12)' }))
    await expect(page.getByRole('dialog', { name: 'Delete images' })).toHaveTextContent('12 synthetic fixture images')
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(page.getByRole('button', { name: 'Delete (12)' })).toBeEnabled()
    await userEvent.click(page.getByRole('button', { name: 'Delete (12)' }))
    await userEvent.click(within(page.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
    await expect(page.getByText('No images yet')).toBeVisible()
    await expect(page.getByText(/Removed 12 synthetic fixture images/)).toBeVisible()
  },
}

export const GroupSelectionWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByText('Select individual images'))
    await userEvent.click(page.getAllByRole('button', { name: 'Grid item' })[0])
    await expect(page.getByRole('button', { name: 'Delete (3)' })).toBeEnabled()
    await expect(page.getByRole('checkbox', { name: 'Select all' })).not.toBeChecked()
    await userEvent.click(page.getAllByRole('button', { name: 'Grid item' })[0])
    await expect(page.getByRole('button', { name: 'Delete' })).toBeDisabled()
    await userEvent.click(page.getByRole('button', { name: /^Delete group:/ }))
    await expect(page.getByRole('dialog')).toHaveTextContent('3 synthetic fixture images')
    await userEvent.click(within(page.getByRole('dialog')).getByRole('button', { name: 'Delete' }))
    await expect(page.getByText(/Showing 9 images in 9 cells/)).toBeVisible()
  },
}

export const FilterDateWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    // The Workspace also contains a log filter; image filter uses expanded state.
    const filter = page.getAllByRole('button', { name: 'Filter' }).find((button) => button.hasAttribute('aria-expanded'))!
    await userEvent.click(filter)
    await userEvent.click(page.getByRole('button', { name: 'Date' }))
    await userEvent.click(page.getByRole('option', { name: 'Today' }))
    await expect(page.getByText(/Showing 4 images in 2 cells/)).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Date' }))
    await userEvent.click(page.getByRole('option', { name: 'Custom range' }))
    await expect(page.getByLabelText('From', { exact: true })).toHaveValue('2026-05-19')
    await expect(page.getByLabelText('To', { exact: true })).toHaveValue('2026-05-20')
    await expect(page.getByText(/Showing 8 images in 6 cells/)).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(filter).toHaveAttribute('aria-expanded', 'false')
    await expect(filter).toHaveFocus()
    await userEvent.click(filter)
    await userEvent.click(page.getByText('Select individual images'))
    await expect(filter).toHaveAttribute('aria-expanded', 'false')
  },
}

export const InspectorWorkflow: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const image = page.getAllByRole('button', { name: 'Grid item' })[0]
    image.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const firstName = dialog.querySelector('img')?.getAttribute('alt')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next image' }))
    await expect(dialog.querySelector('img')).not.toHaveAttribute('alt', firstName)
    await userEvent.keyboard('{ArrowLeft}')
    await expect(dialog.querySelector('img')).toHaveAttribute('alt', firstName)
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(image).toHaveFocus()
  },
}
