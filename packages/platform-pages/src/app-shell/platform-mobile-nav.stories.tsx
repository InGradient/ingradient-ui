import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PlatformMobileNav, type PlatformMobileNavProps } from './platform-mobile-nav'

type DemoProps = Omit<PlatformMobileNavProps, 'open' | 'onOpen' | 'onClose' | 'activeKey'> & { initialOpen?: boolean }

function MobileNavDemo({ initialOpen = false, onNavigate, ...rest }: DemoProps) {
  const [open, setOpen] = useState(initialOpen)
  const [activeKey, setActiveKey] = useState('catalog')
  return (
    <PlatformMobileNav
      {...rest}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      activeKey={activeKey}
      onNavigate={(key) => {
        setActiveKey(key)
        setOpen(false)
        onNavigate(key)
      }}
    />
  )
}

const meta: Meta<typeof MobileNavDemo> = {
  id: 'platform-pages-appshell-platformmobilenav',
  title: 'Components/Platform/AppShell/PlatformMobileNav',
  component: MobileNavDemo,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  args: {
    projectName: 'Sample project',
    noticeCount: 3,
    onNavigate: fn().mockName('onNavigate'),
    onOpenProjects: fn().mockName('onOpenProjects'),
    onOpenNotices: fn().mockName('onOpenNotices'),
    onOpenComments: fn().mockName('onOpenComments'),
    onOpenSettings: fn().mockName('onOpenSettings'),
    onOpenUser: fn().mockName('onOpenUser'),
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = {}
export const Open: Story = { args: { initialOpen: true } }
export const NavigateWorkflow: Story = {
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(body.getByRole('button', { name: 'Open menu' }))
    await userEvent.click(await body.findByRole('button', { name: 'Classes' }))
    await expect(args.onNavigate).toHaveBeenCalledWith('classes')
  },
}
