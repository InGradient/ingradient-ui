import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatasetCardView } from './DatasetCardView'

const dataset = { dataset_id: 'surface', dataset_name: 'Surface defects', project_id: 'inspection', image_count: 12 }
function Demo({ select, exportDataset }: { select: () => void; exportDataset: () => void }) {
  const [menu, setMenu] = useState<string | null>(null)
  return <DatasetCardView dataset={dataset} isRecent={false} isDotMenuOpen={!!menu}
    recentBadgeLabel="Recent" noClassesLabel="No classes" moreLabel="Dataset actions" exportLabel="Export"
    imagesLabel={(count) => `${count} images`} onSelect={select} onToggleDotMenu={setMenu} onExportClick={exportDataset} />
}

describe('DatasetCardView keyboard and independent actions', () => {
  it('uses a native selection button for Enter and Space without nesting the kebab', async () => {
    const select = vi.fn()
    const exportDataset = vi.fn()
    const { container } = render(<Demo select={select} exportDataset={exportDataset} />)
    const user = userEvent.setup()
    await user.tab()
    expect(screen.getByRole('button', { name: dataset.dataset_name })).toHaveFocus()
    await user.keyboard('{Enter} ')
    expect(select).toHaveBeenCalledTimes(2)
    expect(select).toHaveBeenLastCalledWith(dataset)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Dataset actions' })).toHaveFocus()
    expect(container.querySelector('button button')).toBeNull()
    expect(exportDataset).not.toHaveBeenCalled()
  })
  it('opens the kebab from the keyboard and restores focus without selecting the card', async () => {
    const select = vi.fn()
    const exportDataset = vi.fn()
    render(<Demo select={select} exportDataset={exportDataset} />)
    const user = userEvent.setup()
    const trigger = screen.getByRole('button', { name: 'Dataset actions' })
    trigger.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard(' ')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(exportDataset).toHaveBeenCalledOnce()
    expect(exportDataset).toHaveBeenCalledWith(dataset)
    expect(select).not.toHaveBeenCalled()
    expect(trigger).toHaveFocus()
  })
})
