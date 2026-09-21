import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { DatasetCardView } from './DatasetCardView'

const meta = {
  title: 'Edge Pages/Dataset Select/DatasetCard',
  component: DatasetCardView,
  parameters: { a11y: { test: 'error' } },
  args: {
    dataset: { dataset_id: 'surface', dataset_name: 'Surface defects', project_id: 'inspection', image_count: 12 },
    isRecent: false, isDotMenuOpen: false, recentBadgeLabel: 'Recent', noClassesLabel: 'No classes',
    moreLabel: 'Dataset actions', exportLabel: 'Export', imagesLabel: (count: number) => `${count} images`,
    onSelect: fn(), onToggleDotMenu: fn(), onExportClick: fn(),
  },
} satisfies Meta<typeof DatasetCardView>
export default meta
type Story = StoryObj<typeof meta>

export const KeyboardSelection: Story = {
  render: (args) => {
    const [menu, setMenu] = useState<string | null>(null)
    return <div style={{ width: 'var(--ig-popup-2xl)', maxWidth: '100%' }}>
      <DatasetCardView {...args} isDotMenuOpen={menu === args.dataset.dataset_id} onToggleDotMenu={(id) => { args.onToggleDotMenu(id); setMenu(id) }} />
    </div>
  },
  play: async ({ args, canvas, userEvent }) => {
    const select = canvas.getByRole('button', { name: args.dataset.dataset_name })
    select.focus()
    await userEvent.keyboard('{Enter} ')
    await expect(args.onSelect).toHaveBeenCalledTimes(2)
    await expect(args.onSelect).toHaveBeenLastCalledWith(args.dataset)
    await userEvent.tab()
    const trigger = canvas.getByRole('button', { name: args.moreLabel })
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: args.exportLabel })).toHaveFocus())
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard(' ')
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: args.exportLabel })).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(args.onExportClick).toHaveBeenCalledWith(args.dataset)
    await expect(args.onSelect).toHaveBeenCalledTimes(2)
    await expect(args.onToggleDotMenu).toHaveBeenLastCalledWith(null)
    await expect(trigger).toHaveFocus()
  },
}
