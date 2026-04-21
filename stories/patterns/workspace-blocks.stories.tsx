import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, HoverCard } from '@ingradient/ui/components'
import { Badge } from '../../src/components/feedback/badge'
import { AssignmentRow, PreviewCard, SectionPanel, StatCard } from '../../src/components/data-display'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Workspace Blocks',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function previewSvg(title: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 320">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="560" height="320" fill="url(#g)" />
      <circle cx="112" cy="94" r="56" fill="rgba(255,255,255,0.16)" />
      <circle cx="430" cy="228" r="88" fill="rgba(255,255,255,0.10)" />
      <text x="44" y="268" font-family="IBM Plex Sans, sans-serif" font-size="30" fill="white" opacity="0.92">${title}</text>
    </svg>
  `)}`
}

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="Workspace Blocks"
      description="Workspace blocks are the reusable dense-screen building blocks that used to live mostly in the design showcase. This story keeps their composition visible in one operational sandbox."
    >
      <StorybookSection
        title="Dense operational surfaces"
        description="Review stat, assignment, preview, and supporting panel blocks as a coherent family instead of isolated one-off cards."
      >
        <StorybookStack gap={20}>
          <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
            <StatCard
              label="Active inspections"
              value="128"
              hint="12 queued in review"
              meta={<Badge $tone="accent">live</Badge>}
            />
            <StatCard
              label="Approval rate"
              value="97.4%"
              hint="Last 7 days"
              meta={<Badge $tone="success">stable</Badge>}
            />
            <StatCard
              label="Escalations"
              value="4"
              hint="2 require follow-up today"
              meta={<Badge $tone="warning">watch</Badge>}
            />
          </StorybookGrid>

          <StorybookGrid columns="minmax(0, 1.4fr) minmax(320px, 1fr)">
            <SectionPanel>
              <StorybookStack gap={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ig-color-text-primary)' }}>Assignments</div>
                    <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>Representative dense rows for review queues and operational ownership.</div>
                  </div>
                  <Button variant="secondary">Reassign all</Button>
                </div>
                <StorybookStack gap={12}>
                  <AssignmentRow
                    title="Metal surface audit"
                    description="Primary reviewer: J. Kim"
                    meta={<Badge>Ready</Badge>}
                    control={<Button variant="secondary">Open</Button>}
                  />
                  <AssignmentRow
                    title="Training set refresh"
                    description="Pending asset validation before export"
                    meta={<Badge $tone="warning">Blocked</Badge>}
                    control={<Button variant="secondary">Inspect</Button>}
                  />
                  <AssignmentRow
                    title="Template sync"
                    description="Read-only while workspace sync is running"
                    meta={<Badge $tone="accent">Syncing</Badge>}
                    control={<Button variant="secondary" disabled>Locked</Button>}
                  />
                </StorybookStack>
              </StorybookStack>
            </SectionPanel>

            <StorybookStack gap={16}>
              <PreviewCard
                title="Inspection asset"
                description="Preview-style block for image-first workspace lists and template browsers."
                imageSrc={previewSvg('Inspection', '#1c4f96', '#32c5a4')}
                meta={<Badge $tone="accent">Preview</Badge>}
                actions={<Button variant="secondary">Review</Button>}
              />
              <HoverCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ig-color-text-primary)' }}>Hover details</div>
                  <Badge $tone="success">Healthy</Badge>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                  HoverCard stays intentionally generic. Product-specific summaries and next actions still belong to the consumer layer.
                </div>
                <div style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>
                  Last updated 5 minutes ago by M. Park
                </div>
              </HoverCard>
            </StorybookStack>
          </StorybookGrid>
        </StorybookStack>
      </StorybookSection>
    </StorybookPage>
  ),
}
