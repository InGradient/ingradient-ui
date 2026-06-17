import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordChangeDialog } from './password-change-dialog'

const meta: Meta<typeof PasswordChangeDialog> = {
  title: 'Platform Pages/Settings Modal/Account/PasswordChangeDialog',
  component: PasswordChangeDialog,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  open: true,
  currentPassword: '', onChangeCurrentPassword: () => undefined,
  newPassword: '', onChangeNewPassword: () => undefined,
  newPasswordConfirm: '', onChangeNewPasswordConfirm: () => undefined,
  onClose: () => undefined,
  onSubmit: () => undefined,
}

export const Empty: Story = { args: baseArgs }

export const Filled: Story = {
  args: { ...baseArgs, currentPassword: 'oldpass', newPassword: 'newpass123', newPasswordConfirm: 'newpass123' },
}

export const Mismatch: Story = {
  args: { ...baseArgs, currentPassword: 'oldpass', newPassword: 'newpass123', newPasswordConfirm: 'different' },
}

export const Saving: Story = {
  args: { ...baseArgs, saving: true, currentPassword: 'x', newPassword: 'y', newPasswordConfirm: 'y' },
}

export const SuccessMessage: Story = {
  args: { ...baseArgs, passwordMessage: 'Password changed.' },
}

export const ErrorMessage: Story = {
  args: { ...baseArgs, passwordMessage: 'Current password is incorrect.' },
}

export const Closed: Story = { args: { ...baseArgs, open: false } }

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [cur, setCur] = useState('')
    const [nw, setNw] = useState('')
    const [cf, setCf] = useState('')
    return (
      <PasswordChangeDialog
        open={open}
        currentPassword={cur} onChangeCurrentPassword={setCur}
        newPassword={nw} onChangeNewPassword={setNw}
        newPasswordConfirm={cf} onChangeNewPasswordConfirm={setCf}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
      />
    )
  },
}
