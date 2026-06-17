import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextInputDialog } from './text-input-dialog'

const meta: Meta<typeof TextInputDialog> = {
  title: 'Components/Overlays/TextInputDialog',
  component: TextInputDialog,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { open: true, value: '', onChange: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Filled: Story = {
  args: { open: true, value: 'Crack', onChange: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Closed: Story = {
  args: { open: false, value: '', onChange: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
}

export const Interactive: Story = {
  args: { open: true, value: '', onChange: () => undefined, onClose: () => undefined, onConfirm: () => undefined },
  render: () => {
    const [open, setOpen] = useState(true)
    const [value, setValue] = useState('')
    return (
      <TextInputDialog
        open={open}
        value={value}
        onChange={setValue}
        onClose={() => setOpen(false)}
        onConfirm={() => { setOpen(false); setValue('') }}
        title="Class name"
        placeholder="Enter class name"
      />
    )
  },
}
