import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../inputs/button'
import { IconButton } from '../inputs/icon-button'
import { Tooltip } from './tooltip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    content: 'Short hint for a dense action control.',
    children: <Button variant="secondary">Hover trigger</Button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Tooltip"
      description="Tooltip is the compact hint layer for dense controls and truncated context. It should explain, not carry critical workflow content."
    >
      <StorybookSection
        title="Hover review"
        description="Review tooltip usage in action-heavy controls and inside constrained containers."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Common triggers" subtitle="buttons and icon buttons">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <Tooltip content="Publish the current review package for downstream consumers.">
                <Button variant="secondary">Publish</Button>
              </Tooltip>
              <Tooltip content="This icon-only control opens a supporting inspector panel.">
                <IconButton variant="secondary" aria-label="Open inspector">
                  <span aria-hidden>i</span>
                </IconButton>
              </Tooltip>
            </div>
          </StorybookCard>
          <StorybookCard title="Overflow-safe behavior" subtitle="fixed-position bubble">
            <StorybookStack gap={12}>
              <div
                style={{
                  width: 220,
                  overflow: 'hidden',
                  border: '1px solid var(--ig-color-border-subtle)',
                  borderRadius: 18,
                  padding: 12,
                  background: 'var(--ig-color-surface-panel)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip content="Tooltip stays visible even when the parent container clips overflow.">
                    <IconButton variant="secondary" aria-label="Info">
                      <span aria-hidden>?</span>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                Hover the icon near the container edge to verify viewport clamping.
              </div>
            </StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
