import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConfirmProvider, useConfirm } from './use-confirm'
import { Button } from '../../components/inputs/button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Dialogs/useConfirm',
  component: ConfirmProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ConfirmProvider>

export default meta

type Story = StoryObj<typeof meta>

function Demo({ label, options, onResult }: { label: string; options: Parameters<ReturnType<typeof useConfirm>>[0]; onResult: (result: boolean) => void }) {
  const confirm = useConfirm()
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        const result = await confirm(options)
        onResult(result)
      }}
    >
      {label}
    </Button>
  )
}

export const Review: Story = {
  args: { children: null },
  render: () => {
    const [lastResult, setLastResult] = React.useState<string>('—')

    return (
      <ConfirmProvider>
        <StorybookPage
          title="useConfirm"
          description="Imperative confirm API. Wrap app in <ConfirmProvider>, then call await confirm(...) to get true/false. Replaces native window.confirm() for consistent UX across the app."
        >
          <StorybookSection
            title="Variants"
            description="Click any button to open the dialog. Result of the most recent confirm is shown below."
          >
            <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
              <StorybookCard title="Default" subtitle="title + description, OK / Cancel">
                <Demo
                  label="Open default"
                  options={{
                    title: 'Apply changes?',
                    description: 'Your unsaved changes will be applied to the dataset.',
                  }}
                  onResult={(r) => setLastResult(r ? 'confirmed' : 'cancelled')}
                />
              </StorybookCard>
              <StorybookCard title="Danger variant" subtitle="destructive action, red confirm">
                <Demo
                  label="Open danger"
                  options={{
                    title: 'Delete dataset?',
                    description: 'This action cannot be undone. All images will be permanently removed.',
                    danger: true,
                  }}
                  onResult={(r) => setLastResult(r ? 'confirmed (danger)' : 'cancelled')}
                />
              </StorybookCard>
              <StorybookCard title="Custom labels" subtitle="confirmLabel + cancelLabel">
                <Demo
                  label="Open custom labels"
                  options={{
                    title: 'Discard draft?',
                    description: 'You haven\'t saved this draft yet.',
                    confirmLabel: 'Discard',
                    cancelLabel: 'Keep editing',
                    danger: true,
                  }}
                  onResult={(r) => setLastResult(r ? 'discarded' : 'kept')}
                />
              </StorybookCard>
              <StorybookCard title="Title only" subtitle="no description (concise prompt)">
                <Demo
                  label="Open title-only"
                  options={{ title: 'Sign out?' }}
                  onResult={(r) => setLastResult(r ? 'signed out' : 'cancelled')}
                />
              </StorybookCard>
            </StorybookGrid>
          </StorybookSection>

          <StorybookSection title="Last result" description="Updated after each dialog closes.">
            <div style={{ padding: 'var(--ig-space-5)', fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-secondary)' }}>
              <code>{lastResult}</code>
            </div>
          </StorybookSection>
        </StorybookPage>
      </ConfirmProvider>
    )
  },
}
