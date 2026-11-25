import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PlatformMobileNav } from './platform-mobile-nav'

// The drawer is display:none outside the mobile breakpoint, so jsdom queries include hidden nodes.
const base = { open: true, onOpen: () => undefined, onClose: () => undefined, activeKey: 'catalog', onNavigate: () => undefined }

describe('PlatformMobileNav', () => {
  it('reports navigation by key and opens the project switcher from the drawer title', () => {
    const onNavigate = vi.fn()
    const onOpenProjects = vi.fn()
    render(<PlatformMobileNav {...base} onNavigate={onNavigate} projectName="Sample project" onOpenProjects={onOpenProjects} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dashboard', hidden: true }))
    fireEvent.click(screen.getByRole('button', { name: /Sample project/, hidden: true }))
    expect(onNavigate).toHaveBeenCalledWith('dashboard')
    expect(onOpenProjects).toHaveBeenCalled()
  })

  it('renders bottom rows only for provided handlers and hands the user row to onOpenUser', () => {
    const onOpenUser = vi.fn()
    render(<PlatformMobileNav {...base} noticeCount={3} onOpenNotices={() => undefined} onOpenUser={onOpenUser} />)
    expect(screen.getByRole('button', { name: /Notice/, hidden: true })).toHaveTextContent('3')
    expect(screen.queryByRole('button', { name: 'Comment', hidden: true })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Settings', hidden: true })).not.toBeInTheDocument()
    const user = screen.getByRole('button', { name: 'User', hidden: true })
    fireEvent.click(user)
    expect(onOpenUser).toHaveBeenCalledWith(user)
  })
})
