import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AddDatasetModal } from './add-dataset-modal'
import { Button } from '../../components/inputs/button'

const CLASSES = [
  { id: 'c1', name: 'Crack', color: '#ff6b6b' },
  { id: 'c2', name: 'Scratch', color: '#feca57' },
  { id: 'c3', name: 'Dent', color: '#48dbfb' },
]

const meta: Meta<typeof AddDatasetModal> = {
  title: 'Patterns/Dialogs/AddDatasetModal',
  component: AddDatasetModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

function Demo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ padding: 'var(--ig-space-7)' }}>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <AddDatasetModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(p) => { alert(JSON.stringify(p)); setOpen(false) }}
        classes={CLASSES}
      />
    </div>
  )
}

export const Default: Story = { render: () => <Demo /> }
