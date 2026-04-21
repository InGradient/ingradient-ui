import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '../inputs/button'
import { ToastProvider, useToast } from './toast'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof ToastProvider>

export default meta

type Story = StoryObj<typeof meta>

function ToastDemo() {
  const toast = useToast()

  return (
    <StorybookStack gap={12}>
      <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
        ToastProvider supplies ephemeral alerts through `useToast`. Click any button to push a toast into the stack.
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button variant="accent" onClick={() => toast('Upload completed', { tone: 'success' })}>
          Show success toast
        </Button>
        <Button variant="secondary" onClick={() => toast('Queue is syncing', { tone: 'info' })}>
          Show info toast
        </Button>
        <Button variant="secondary" onClick={() => toast('Storage quota is almost full', { tone: 'warning' })}>
          Show warning toast
        </Button>
        <Button variant="secondary" onClick={() => toast('Export failed', { tone: 'danger' })}>
          Show error toast
        </Button>
      </div>
    </StorybookStack>
  )
}

export const Review: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ToastProvider>
      <StorybookPage
        title="Toast"
        description="ToastProvider is the transient alert layer for success, warning, and failure feedback that should not block the current workflow."
      >
        <StorybookSection
          title="Ephemeral feedback"
          description="Validate tone, stack behavior, and click-to-dismiss interaction before consumers build product-specific wrappers."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <StorybookCard title="Provider + hook" subtitle="transient alerts">
              <ToastDemo />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    </ToastProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /show success toast/i }))
    await expect(canvas.getByRole('alert')).toBeInTheDocument()
  },
}
