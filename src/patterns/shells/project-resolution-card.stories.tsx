import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectResolutionCard, type ProjectResolution } from './project-resolution-card'

const candidates = [
  { user_id: 'u-a', name: 'Soyeon Park', email: 'soyeon@ingradient.ai' },
  { user_id: 'u-b', name: 'Junho Kim', email: 'junho@ingradient.ai' },
  { user_id: 'u-c', email: 'minji@ingradient.ai' },
]

const project = {
  project_id: 'p-1',
  project_name: 'Wafer line A — production',
  role: 'owner',
  member_count: 4,
  owner_count: 1,
  transfer_candidates: candidates,
}

const meta: Meta<typeof ProjectResolutionCard> = {
  title: 'Patterns/Shells/ProjectResolutionCard',
  component: ProjectResolutionCard,
  decorators: [(Story) => <div style={{ width: 520, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const TransferAction: Story = {
  args: { project, resolution: { action: 'transfer' }, onChange: () => undefined },
}

export const TransferWithTarget: Story = {
  args: { project, resolution: { action: 'transfer', transfer_user_id: 'u-a' }, onChange: () => undefined },
}

export const DeleteAction: Story = {
  args: { project, resolution: { action: 'delete_project' }, onChange: () => undefined },
}

export const Interactive: Story = {
  render: () => {
    const [r, setR] = useState<ProjectResolution>({ action: 'transfer' })
    return <ProjectResolutionCard project={project} resolution={r} onChange={setR} />
  },
}
