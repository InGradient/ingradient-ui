import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PlatformAppShell } from './PlatformAppShell'

const renderShell = (props: Partial<React.ComponentProps<typeof PlatformAppShell>> = {}) =>
  render(
    <PlatformAppShell activeKey="catalog" defaultExpanded projectName="Wafer-2026" {...props}>
      <div>page content</div>
    </PlatformAppShell>,
  )

describe('PlatformAppShell', () => {
  it('renders the page inside the shell and marks the active row', () => {
    renderShell()
    expect(screen.getByText('page content')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'App sidebar' })).toBeInTheDocument()
  })

  it('hands plain clicks to onNavigate and keeps real hrefs', () => {
    const onNavigate = vi.fn()
    renderShell({ onNavigate })
    const dashboard = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboard).toHaveAttribute('href', '/dashboard')
    fireEvent.click(dashboard)
    expect(onNavigate).toHaveBeenCalledWith('dashboard')
  })

  it('leaves modifier clicks to the browser so links open in a new tab', () => {
    const onNavigate = vi.fn()
    renderShell({ onNavigate })
    fireEvent.click(screen.getByRole('link', { name: 'Classes' }), { metaKey: true })
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('collapses and expands, reporting the new state', () => {
    const onExpandedChange = vi.fn()
    renderShell({ onExpandedChange })
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
    expect(onExpandedChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByText('Wafer-2026')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }))
    expect(onExpandedChange).toHaveBeenLastCalledWith(true)
  })

  it('shows the project switcher and the settings and sign-out actions when provided', () => {
    const onOpenProjects = vi.fn()
    const onOpenSettings = vi.fn()
    const onSignOut = vi.fn()
    renderShell({ onOpenProjects, onOpenSettings, onSignOut })
    fireEvent.click(screen.getByRole('button', { name: 'Project: Wafer-2026' }))
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(onOpenProjects).toHaveBeenCalled()
    expect(onOpenSettings).toHaveBeenCalled()
    expect(onSignOut).toHaveBeenCalled()
  })
})
