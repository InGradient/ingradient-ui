import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPill, type StatusTone } from './status'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof StatusPill>

export default meta

type Story = StoryObj<typeof meta>

const tones: Array<{ tone: StatusTone; label: string }> = [
  { tone: 'running', label: 'Running' },
  { tone: 'completed', label: 'Completed' },
  { tone: 'queued', label: 'Queued' },
  { tone: 'draft', label: 'Draft' },
  { tone: 'failed', label: 'Failed' },
  { tone: 'stopped', label: 'Stopped' },
  { tone: 'interrupted', label: 'Interrupted' },
  { tone: 'warning', label: 'Warning' },
  { tone: 'idle', label: 'Idle' },
]

export const Review: Story = {
  args: {},
  render: () => (
    <StorybookPage
      title="StatusPill"
      description="Pill-shaped status indicator. Nine semantic tones for job/task/process state. Tone-only ($tone or tone prop) — pure visual semantic mapping."
    >
      <StorybookSection title="All tones" description="Each StatusTone with its label.">
        <StorybookGrid columns="repeat(auto-fit, minmax(160px, 1fr))">
          {tones.map(({ tone, label }) => (
            <StorybookCard key={tone} title={tone}>
              <StatusPill $tone={tone}>{label}</StatusPill>
            </StorybookCard>
          ))}
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Use case — task list" description="Multiple states in a single panel.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Job dashboard">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
              {[
                { task: 'Image upload sync', tone: 'running' as StatusTone },
                { task: 'Capture 2026-05-08', tone: 'completed' as StatusTone },
                { task: 'Capture 2026-05-09', tone: 'queued' as StatusTone },
                { task: 'Calibration', tone: 'draft' as StatusTone },
                { task: 'Network probe', tone: 'failed' as StatusTone },
              ].map(({ task, tone }) => (
                <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
                  <span style={{ flex: 1, fontSize: 'var(--ig-font-size-sm)' }}>{task}</span>
                  <StatusPill $tone={tone}>{tone}</StatusPill>
                </div>
              ))}
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
