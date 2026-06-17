import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DeleteProjectSection } from './delete-project-section'

const meta: Meta<typeof DeleteProjectSection> = {
  title: 'Platform Pages/Settings Modal/Project/DeleteProjectSection',
  component: DeleteProjectSection,
  decorators: [(Story) => <div style={{ width: 600, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined
const projectName = 'Wafer line A'

export const Empty: Story = {
  args: { projectName, confirmInput: '', onChangeConfirmInput: noop, onDelete: noop },
}

export const PartialMatch: Story = {
  args: { projectName, confirmInput: 'Wafer', onChangeConfirmInput: noop, onDelete: noop },
}

export const ExactMatch: Story = {
  args: { projectName, confirmInput: projectName, onChangeConfirmInput: noop, onDelete: noop },
}

export const Deleting: Story = {
  args: { projectName, confirmInput: projectName, pending: true, onChangeConfirmInput: noop, onDelete: noop },
}

export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState('')
    return <DeleteProjectSection projectName={projectName} confirmInput={v} onChangeConfirmInput={setV} onDelete={() => undefined} />
  },
}
