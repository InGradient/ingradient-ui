import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  AccountMenuView,
  type AccountMenuLabels,
  type AccountUser,
  type AccountHistoryEntry,
} from '@ingradient/edge-pages'
import { SAMPLE_USER, SAMPLE_HISTORY } from '../../../../fixtures/edge/0.0.1/account-history'

const LABELS: AccountMenuLabels = {
  account: 'Account',
  changeAccount: 'Switch account',
  logout: 'Sign out',
  accountHistory: 'Recent accounts',
  noAccountHistory: 'No recent accounts.',
  cancel: 'Cancel',
}

function AccountMenuScene(args: {
  currentUser?: AccountUser | null
  history?: AccountHistoryEntry[]
  dropdownOpen?: boolean
  changeAccountModalOpen?: boolean
}) {
  const [dropdownOpen, setDropdownOpen] = useState(args.dropdownOpen ?? false)
  const [changeAccountModalOpen, setChangeAccountModalOpen] = useState(args.changeAccountModalOpen ?? false)
  return (
    <div style={{ padding: 24, minHeight: 200, background: 'var(--ig-color-bg-canvas)', display: 'flex', justifyContent: 'flex-end' }}>
      <AccountMenuView
        currentUser={args.currentUser !== undefined ? args.currentUser : SAMPLE_USER}
        accountHistory={args.history ?? SAMPLE_HISTORY}
        dropdownOpen={dropdownOpen}
        changeAccountModalOpen={changeAccountModalOpen}
        labels={LABELS}
        onToggleDropdown={() => setDropdownOpen((v) => !v)}
        onCloseDropdown={() => setDropdownOpen(false)}
        onOpenChangeAccount={() => { setChangeAccountModalOpen(true); setDropdownOpen(false) }}
        onCloseChangeAccount={() => setChangeAccountModalOpen(false)}
        onLogout={() => undefined}
        onSelectAccount={() => undefined}
      />
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Chrome/AccountMenu',
  component: AccountMenuScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AccountMenuScene>

export default meta

type Story = StoryObj<typeof meta>

export const Closed: Story = { args: {} }
export const DropdownOpen: Story = { args: { dropdownOpen: true } }
export const ChangeAccountModal: Story = { args: { changeAccountModalOpen: true } }
export const NoHistory: Story = { args: { changeAccountModalOpen: true, history: [] } }
