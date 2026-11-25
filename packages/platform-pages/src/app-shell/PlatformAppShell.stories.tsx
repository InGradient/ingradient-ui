import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PlatformAppShell } from './PlatformAppShell'

const PAGE_STYLE = { padding: 'var(--ig-spacing-24)', color: 'var(--ig-color-text-muted)' }

const meta: Meta<typeof PlatformAppShell> = {
  id: 'platform-pages-appshell-platformappshell',
  title: 'Components/Platform/AppShell/PlatformAppShell',
  component: PlatformAppShell,
  parameters: { layout: 'fullscreen' },
  args: {
    activeKey: 'catalog',
    defaultExpanded: true,
    projectName: 'Sample project',
    children: <div style={PAGE_STYLE}>Page content</div>,
    onNavigate: fn().mockName('onNavigate'),
    onOpenProjects: fn().mockName('onOpenProjects'),
    onOpenSettings: fn().mockName('onOpenSettings'),
  },
}
export default meta

type Story = StoryObj<typeof meta>

const accountRows = {
  noticeCount: 3,
  onOpenNotices: fn().mockName('onOpenNotices'),
  onOpenComments: fn().mockName('onOpenComments'),
  onOpenUser: fn().mockName('onOpenUser'),
}

/** Settings and Sign out only — the rows the shell had before the opt-in rows were added. */
export const SettingsAndSignOut: Story = { args: { onSignOut: fn().mockName('onSignOut') } }

export const NoticeCommentUserRows: Story = {
  args: accountRows,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Notice/ }))
    await expect(args.onOpenNotices).toHaveBeenCalled()
    const user = canvas.getByRole('button', { name: 'User' })
    await userEvent.click(user)
    await expect(args.onOpenUser).toHaveBeenCalledWith(user)
  },
}

export const NoUnseenNotices: Story = { args: { ...accountRows, noticeCount: 0 } }

export const Collapsed: Story = { args: { ...accountRows, defaultExpanded: false } }
