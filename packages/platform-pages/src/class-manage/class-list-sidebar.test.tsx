import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ClassListSidebar } from './class-list-sidebar'

describe('ClassListSidebar', () => {
  it('calls onCollapse from the sidebar header action', () => {
    const onCollapse = vi.fn()

    render(<ClassListSidebar classes={[]} onCollapse={onCollapse} />)
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))

    expect(onCollapse).toHaveBeenCalledOnce()
  })

  it('does not render a collapse action without a handler', () => {
    render(<ClassListSidebar classes={[]} />)

    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument()
  })

  it('opens a class menu from the row action', () => {
    const onOpenClassMenu = vi.fn()

    render(
      <ClassListSidebar
        classes={[{ id: 'c-1', name: 'Crack', color: '#ef4444' }]}
        onOpenClassMenu={onOpenClassMenu}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open menu for Crack' }))

    expect(onOpenClassMenu).toHaveBeenCalledWith('c-1', expect.any(HTMLElement))
  })

  it('keeps the shared selected-row styling contract for list buttons', () => {
    render(
      <ClassListSidebar
        classes={[{ id: 'c-1', name: 'Crack', color: '#ef4444' }]}
        selectedClassId="c-1"
      />,
    )

    const row = screen.getByRole('button', { name: 'Crack' })
    expect(row).toHaveAttribute('data-ig-component', 'SelectableListItem')
    expect(row).not.toHaveAttribute('variant')
    expect(row).toHaveAttribute('aria-current', 'true')
  })
})
