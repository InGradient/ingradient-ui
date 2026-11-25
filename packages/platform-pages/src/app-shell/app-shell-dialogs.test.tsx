import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccountSwitchDialog } from './account-switch-dialog'
import { CommentedImagesDialog } from './commented-images-dialog'
import { NoticesDialog } from './notices-dialog'
import { PlatformUserMenu, placeUserMenu } from './platform-user-menu'
import { ProjectSwitcherDialog } from './project-switcher-dialog'

const noop = () => undefined

describe('NoticesDialog', () => {
  const notices = [
    { id: 'n1', title: 'Mention', description: 'You were mentioned.', createdAtLabel: 'Today', canOpen: true },
    { id: 'n2', title: 'Export', description: 'Export finished.', createdAtLabel: 'Yesterday' },
  ]

  it('shows Open only for notices that can be opened and reports ids', () => {
    const onOpen = vi.fn()
    const onArchive = vi.fn()
    render(<NoticesDialog open notices={notices} onClose={noop} onArchive={onArchive} onOpen={onOpen} />)
    expect(screen.getAllByRole('button', { name: 'Open' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Archive notice: Export' }))
    expect(onOpen).toHaveBeenCalledWith('n1')
    expect(onArchive).toHaveBeenCalledWith('n2')
  })

  it('shows loading and empty hints', () => {
    const { rerender } = render(<NoticesDialog open loading notices={[]} onClose={noop} onArchive={noop} />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    rerender(<NoticesDialog open notices={[]} onClose={noop} onArchive={noop} />)
    expect(screen.getByText('No new notices.')).toBeInTheDocument()
  })
})

describe('CommentedImagesDialog', () => {
  it('opens the image of the clicked row', () => {
    const onOpenImage = vi.fn()
    const items = [{ imageId: 'i1', imageName: 'a.png', thumbUrl: 'a', latestAtLabel: 'Today', latestAuthor: 'Alex', latestPreview: 'Hi', commentCount: 1 }]
    render(<CommentedImagesDialog open items={items} onClose={noop} onOpenImage={onOpenImage} />)
    expect(screen.getByText('1 comment')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /a\.png/ }))
    expect(onOpenImage).toHaveBeenCalledWith('i1')
  })
})

describe('ProjectSwitcherDialog', () => {
  it('cannot be dismissed while a selection is required and there are no projects', () => {
    render(<ProjectSwitcherDialog open requireSelection projects={[]} onClose={noop} onSelect={noop} onCreate={noop} />)
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Project' })).toBeInTheDocument()
  })

  it('stays dismissable when projects exist and reports selection and creation', () => {
    const onSelect = vi.fn()
    const onCreate = vi.fn()
    render(
      <ProjectSwitcherDialog
        open requireSelection projects={[{ id: 'p1', name: 'One' }, { id: 'p2', name: 'Two' }]} currentId="p1"
        onClose={noop} onSelect={onSelect} onCreate={onCreate}
      />,
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    fireEvent.click(screen.getByText('Two'))
    fireEvent.click(screen.getByRole('button', { name: '+ Add Project' }))
    expect(onSelect).toHaveBeenCalledWith('p2')
    expect(onCreate).toHaveBeenCalled()
  })
})

describe('AccountSwitchDialog', () => {
  it('marks the current account and reports the chosen email', () => {
    const onSelect = vi.fn()
    render(<AccountSwitchDialog open accounts={['a@x.io', 'b@x.io']} currentEmail="a@x.io" onClose={noop} onSelect={onSelect} />)
    expect(screen.getAllByText('Current account')).toHaveLength(1)
    fireEvent.click(screen.getByText('b@x.io'))
    expect(onSelect).toHaveBeenCalledWith('b@x.io')
  })
})

describe('PlatformUserMenu', () => {
  it('renders only the provided items and closes before running the action', () => {
    const calls: string[] = []
    const anchor = document.createElement('button')
    document.body.appendChild(anchor)
    const { rerender } = render(<PlatformUserMenu anchorEl={null} onClose={noop} onSignOut={noop} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    rerender(<PlatformUserMenu anchorEl={anchor} onClose={() => calls.push('close')} onSignOut={() => calls.push('signOut')} />)
    expect(screen.getAllByRole('menuitem')).toHaveLength(1)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Log out' }))
    expect(calls).toEqual(['close', 'signOut'])
    expect(anchor).toHaveFocus()
    anchor.remove()
  })

  it('opens beside a sidebar row and under or above a row that reaches the right edge', () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const row = (left: number, top: number, width: number) => new DOMRect(left, top, width, 40)
    expect(placeUserMenu(row(0, 100, 200), 180, 120)).toEqual({ top: 100, left: 208 })
    const fullWidth = placeUserMenu(row(0, 100, viewport.width), 180, 120)
    expect(fullWidth).toEqual({ top: 148, left: viewport.width - 180 - 8 })
    const nearBottom = placeUserMenu(row(0, viewport.height - 60, viewport.width), 180, 120)
    expect(nearBottom.top).toBe(viewport.height - 60 - 8 - 120)
  })
})
