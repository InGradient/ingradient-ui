import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MainLayoutView } from './MainLayoutView'

describe('MainLayoutView capture lock', () => {
  it('does not nest a complementary landmark inside a scrolling landmark', () => {
    render(<MainLayoutView isCapturing={false} topBar={null} leftPanel={null}
      centerContent={<button>Workspace</button>} rightPanel={<aside aria-label="Patterns"><button>Pattern</button></aside>} />)
    const aside = screen.getByRole('complementary', { name: 'Patterns' })
    expect(screen.getByRole('group', { name: 'Workspace panels' })).toContainElement(aside)
    expect(aside.parentElement?.closest('[role="region"], main, [role="main"], aside, [role="complementary"]')).toBeNull()
    expect(screen.queryByRole('region', { name: 'Workspace panels' })).not.toBeInTheDocument()
  })
  it('reveals the entire center when keyboard focus returns from a side panel', () => {
    render(<MainLayoutView isCapturing={false} topBar={null} leftPanel={<button>Left</button>}
      centerContent={<button>Workspace</button>} rightPanel={<button>Right</button>} />)
    const panels = screen.getByRole('group', { name: 'Workspace panels' })
    const center = screen.getByRole('button', { name: 'Workspace' }).parentElement!
    // Geometry fixture: JSDOM has no layout. The story checks real 768px bounds.
    Object.defineProperties(panels, { scrollWidth: { value: 1252 }, clientWidth: { value: 768 } })
    panels.style.paddingLeft = '16px'
    vi.spyOn(panels, 'getBoundingClientRect').mockReturnValue({ left: 0 } as DOMRect)
    vi.spyOn(center, 'getBoundingClientRect').mockImplementation(() => ({ left: 306 - panels.scrollLeft } as DOMRect))
    const left = screen.getByRole('button', { name: 'Left' })
    const right = screen.getByRole('button', { name: 'Right' })
    left.scrollIntoView = vi.fn()
    right.scrollIntoView = vi.fn()
    left.focus()
    expect(left.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
    expect(panels.scrollLeft).toBe(0)
    screen.getByRole('button', { name: 'Workspace' }).focus()
    expect(panels.scrollLeft).toBe(290)
    screen.getByRole('button', { name: 'Right' }).focus()
    expect(right).toHaveFocus()
    expect(right.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
    expect(panels.scrollLeft).toBe(290)
  })
  it('does not move a pointer-focused control before its click completes', () => {
    const onAction = vi.fn()
    render(<MainLayoutView isCapturing={false} topBar={null} leftPanel={null}
      centerContent={<button onClick={onAction}>Workspace</button>} rightPanel={null} />)
    const panels = screen.getByRole('group', { name: 'Workspace panels' })
    const action = screen.getByRole('button', { name: 'Workspace' })
    Object.defineProperties(panels, { scrollWidth: { value: 1252 }, clientWidth: { value: 768 } })
    panels.scrollLeft = 480
    vi.spyOn(panels, 'getBoundingClientRect').mockReturnValue({ left: 0 } as DOMRect)
    vi.spyOn(action.parentElement!, 'getBoundingClientRect').mockReturnValue({ left: -174 } as DOMRect)
    fireEvent.pointerDown(action)
    action.focus()
    expect(panels.scrollLeft).toBe(480)
    fireEvent.pointerUp(action)
    fireEvent.click(action)
    expect(onAction).toHaveBeenCalledOnce()
    panels.style.paddingLeft = '16px'
    fireEvent(document, new Event('fullscreenchange'))
    expect(panels.scrollLeft).toBe(290)
  })
  it('makes chrome and side panels inert, then restores them when capture stops', () => {
    const slots = {
      topBar: <button>Settings trigger</button>, leftPanel: <button>Log filter</button>,
      centerContent: <button>Cancellation slot</button>, rightPanel: <button>Pattern</button>,
    }
    const { rerender } = render(<MainLayoutView {...slots} isCapturing />)
    for (const name of ['Settings trigger', 'Log filter', 'Pattern']) {
      expect(screen.getByRole('button', { name }).closest('[inert]')).not.toBeNull()
    }
    const scrollGroup = screen.getByRole('group', { name: 'Workspace panels' })
    expect(scrollGroup).toHaveAttribute('tabindex', '0')
    expect(scrollGroup.closest('[inert]')).toBeNull()
    scrollGroup.focus()
    expect(scrollGroup).toHaveFocus()
    // Do not cancel native scrolling keys or unlock actionable descendants.
    expect(fireEvent.keyDown(scrollGroup, { key: 'ArrowRight' })).toBe(true)
    expect(screen.getByRole('button', { name: 'Pattern' }).closest('[inert]')).not.toBeNull()
    // WorkspaceShell owns the finer-grained lock, leaving dialog cancellation available.
    expect(screen.getByRole('button', { name: 'Cancellation slot' }).closest('[inert]')).toBeNull()
    rerender(<MainLayoutView {...slots} isCapturing={false} />)
    expect(screen.getByRole('button', { name: 'Settings trigger' }).closest('[inert]')).toBeNull()
    expect(screen.getByRole('group', { name: 'Workspace panels' })).toHaveAttribute('tabindex', '0')
  })
})
