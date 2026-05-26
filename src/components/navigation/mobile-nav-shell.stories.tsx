import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, FolderClosed, Image as ImageIcon, LayoutDashboard, MessageCircle, Settings, Tag, User } from 'lucide-react'
import { MobileNavShell, type MobileNavShellItem } from './mobile-nav-shell'

const meta: Meta<typeof MobileNavShell> = {
  title: 'Components/Navigation/MobileNavShell',
  component: MobileNavShell,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({
  initialOpen = false,
  withBadge = false,
}: { initialOpen?: boolean; withBadge?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  const [active, setActive] = useState<string>('catalog')
  const mainItems: MobileNavShellItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} />, active: active === 'dashboard', onClick: () => setActive('dashboard') },
    { key: 'catalog', label: 'Catalog', icon: <ImageIcon size={22} />, active: active === 'catalog', onClick: () => setActive('catalog') },
    { key: 'classes', label: 'Classes', icon: <Tag size={22} />, active: active === 'classes', onClick: () => setActive('classes') },
  ]
  const bottomItems: MobileNavShellItem[] = [
    { key: 'notice', label: 'Notice', icon: <Bell size={22} />, badge: withBadge ? 3 : 0, onClick: () => undefined },
    { key: 'comment', label: 'Comment', icon: <MessageCircle size={22} />, onClick: () => undefined },
    { key: 'settings', label: 'Settings', icon: <Settings size={22} />, onClick: () => undefined },
    { key: 'user', label: 'Profile', icon: <User size={22} />, onClick: () => undefined },
  ]
  return (
    <MobileNavShell
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      appHeaderBrand={<div style={{ width: 28, height: 28, background: 'var(--ig-color-accent)', borderRadius: 6 }} />}
      appHeaderTitle="Ingradient"
      drawerBrand={<div style={{ width: 32, height: 32, background: 'var(--ig-color-accent)', borderRadius: 8 }} />}
      drawerTitle="Acme Project"
      drawerTitleIcon={<FolderClosed size={16} />}
      onDrawerTitleClick={() => undefined}
      mainItems={mainItems}
      bottomItems={bottomItems}
    />
  )
}

export const Default: Story = { render: () => <Demo /> }
export const Open: Story = { render: () => <Demo initialOpen /> }
export const WithBadge: Story = { render: () => <Demo initialOpen withBadge /> }
