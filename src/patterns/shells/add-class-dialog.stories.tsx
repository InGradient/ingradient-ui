import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AddClassDialog } from './add-class-dialog'

const meta: Meta<typeof AddClassDialog> = {
  title: 'Patterns/Shells/AddClassDialog',
  component: AddClassDialog,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { open: true, name: '', onChangeName: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Filled: Story = {
  args: { open: true, name: 'Crack', onChangeName: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Closed: Story = {
  args: { open: false, name: '', onChangeName: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [name, setName] = useState('')
    return (
      <AddClassDialog
        open={open}
        name={name}
        onChangeName={setName}
        onClose={() => setOpen(false)}
        onConfirm={() => { setOpen(false); setName('') }}
      />
    )
  },
}
