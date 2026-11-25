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
    fireEvent.click(screen.getByRole('button', { name: 'Collapse app sidebar' }))
    expect(onExpandedChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByText('Wafer-2026')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Expand app sidebar' }))
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

  it('keeps the notice, comment, and user rows hidden until their handlers are provided', () => {
    renderShell({ onOpenSettings: vi.fn(), noticeCount: 3 })
    expect(screen.queryByRole('button', { name: /Notice/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Comment' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'User' })).not.toBeInTheDocument()
  })

  it('orders the bottom rows and hands the pressed user row to onOpenUser', () => {
    const onOpenNotices = vi.fn()
    const onOpenComments = vi.fn()
    const onOpenUser = vi.fn()
    renderShell({ onOpenNotices, onOpenComments, onOpenSettings: vi.fn(), onOpenUser, noticeCount: 3 })
    const notice = screen.getByRole('button', { name: /Notice/ })
    const user = screen.getByRole('button', { name: 'User' })
    expect(notice).toHaveTextContent('3')
    const rows = [notice, screen.getByRole('button', { name: 'Comment' }), screen.getByRole('button', { name: 'Settings' }), user]
    rows.slice(1).forEach((row, index) => {
      expect(rows[index].compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
    fireEvent.click(notice)
    fireEvent.click(rows[1])
    fireEvent.click(user)
    expect(onOpenNotices).toHaveBeenCalled()
    expect(onOpenComments).toHaveBeenCalled()
    expect(onOpenUser).toHaveBeenCalledWith(user)
  })

  it('hides the notice badge when there is nothing new', () => {
    renderShell({ onOpenNotices: vi.fn(), noticeCount: 0 })
    expect(screen.getByRole('button', { name: 'Notice' })).toHaveTextContent(/^Notice$/)
  })
})
