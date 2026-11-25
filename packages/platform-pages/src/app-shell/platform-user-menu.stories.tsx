import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@ingradient/ui/components'
import { PlatformUserMenu, type PlatformUserMenuProps } from './platform-user-menu'

const FRAME_STYLE = { display: 'flex', alignItems: 'flex-end', height: '100vh', padding: 'var(--ig-spacing-16)' }

const FULL_WIDTH_FRAME_STYLE = { padding: 'var(--ig-spacing-16) 0' }
const FULL_WIDTH_ROW_STYLE = { width: '100%' }

type UserMenuDemoProps = Omit<PlatformUserMenuProps, 'anchorEl' | 'onClose'> & { fullWidthRow?: boolean }

function UserMenuDemo({ fullWidthRow, ...props }: UserMenuDemoProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  return (
    <div style={fullWidthRow ? FULL_WIDTH_FRAME_STYLE : FRAME_STYLE}>
      <Button type="button" variant="secondary" style={fullWidthRow ? FULL_WIDTH_ROW_STYLE : undefined} onClick={(event) => setAnchorEl(event.currentTarget)}>User</Button>
      <PlatformUserMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} {...props} />
    </div>
  )
}

const meta: Meta<typeof UserMenuDemo> = {
  id: 'platform-pages-appshell-platformusermenu',
  title: 'Components/Platform/AppShell/PlatformUserMenu',
  component: UserMenuDemo,
  parameters: { layout: 'fullscreen' },
  args: {
    onChangeAccount: fn().mockName('onChangeAccount'),
    onAddAccount: fn().mockName('onAddAccount'),
    onSignOut: fn().mockName('onSignOut'),
  },
}
export default meta

type Story = StoryObj<typeof meta>

/** Opens beside the row at the bottom of the screen and stays inside the viewport. */
export const OpenFromBottomRow: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = body.getByRole('button', { name: 'User' })
    await userEvent.click(trigger)
    const menu = await body.findByRole('menu', { name: 'Account' })
    await expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight)
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('menu')).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('menuitem', { name: 'Log out' }))
    await expect(args.onSignOut).toHaveBeenCalled()
    await userEvent.click(trigger)
  },
}

/** A row as wide as the screen, like the mobile drawer's User row: the menu opens under it, inside the viewport. */
export const OpenFromFullWidthRow: Story = {
  args: { fullWidthRow: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = body.getByRole('button', { name: 'User' })
    await userEvent.click(trigger)
    const menu = (await body.findByRole('menu', { name: 'Account' })).getBoundingClientRect()
    await expect(menu.right).toBeLessThanOrEqual(window.innerWidth)
    await expect(menu.top).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom)
  },
}
