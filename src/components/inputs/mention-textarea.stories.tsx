import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MentionTextarea, type MentionCandidate } from './mention-textarea'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const candidates: MentionCandidate[] = [
  { id: 'alice', name: 'Alice Kim', secondary: 'alice@ingradient.design' },
  { id: 'brian', name: 'Brian Lee', secondary: 'brian@ingradient.dev' },
  { id: 'celine', name: 'Celine Park', secondary: 'celine@ingradient.ai' },
]

const meta = {
  title: 'Components/Inputs/MentionTextarea',
  component: MentionTextarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    value: '',
    candidates,
    placeholder: 'Type @ to mention a reviewer...',
  },
} satisfies Meta<typeof MentionTextarea>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    value: '',
    onChange: () => undefined,
    candidates,
  },
  render: () => {
    const [value, setValue] = React.useState('Need one more pass from @Ali')
    const [submitted, setSubmitted] = React.useState<{ text: string; mentionIds: string[] } | null>(null)

    return (
      <StorybookPage
        title="Mention Textarea"
        description="MentionTextarea keeps mention discovery and keyboard interaction inside the field while leaving persistence and reviewer workflow in the consumer layer."
      >
        <StorybookSection
          title="Composer review"
          description="Review candidate discovery, insertion behavior, and submission payload in one place."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <StorybookCard title="Interactive composer" subtitle="@ mention flow">
              <StorybookStack gap={12}>
                <MentionTextarea
                  value={value}
                  onChange={setValue}
                  candidates={candidates}
                  placeholder="Type @ to mention a reviewer..."
                  onSubmit={(text, mentionIds) => setSubmitted({ text, mentionIds })}
                />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  Try typing <code>@A</code> or <code>@B</code>, then use arrow keys and Enter. Submit with Ctrl+Enter or Cmd+Enter.
                </div>
                <div
                  style={{
                    border: '1px solid var(--ig-color-border-subtle)',
                    borderRadius: 16,
                    padding: 14,
                    background: 'var(--ig-color-surface-panel)',
                    color: 'var(--ig-color-text-secondary)',
                    fontSize: 13,
                  }}
                >
                  {submitted ? (
                    <>
                      <div><strong>Submitted text:</strong> {submitted.text}</div>
                      <div><strong>Mention ids:</strong> {submitted.mentionIds.join(', ') || 'none'}</div>
                    </>
                  ) : (
                    'No submission yet.'
                  )}
                </div>
              </StorybookStack>
            </StorybookCard>
            <StorybookCard title="Disabled state" subtitle="read-only review">
              <StorybookStack gap={12}>
                <MentionTextarea
                  value="@Alice Kim review is locked while sync is running."
                  onChange={() => undefined}
                  candidates={candidates}
                  disabled
                />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  Use the disabled state when comments are temporarily unavailable, not as a permanent read-only transcript view.
                </div>
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
