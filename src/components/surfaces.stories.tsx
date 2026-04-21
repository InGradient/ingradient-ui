import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './navigation'
import { Accordion, Card, Paper } from './index'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Surfaces',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [tab, setTab] = React.useState('overview')

    return (
      <StorybookPage
        title="Surfaces"
        description="Surface components define information hierarchy before product-specific content is introduced. Review basic section shells, highlighted cards, and disclosure surfaces here."
      >
        <StorybookSection
          title="Surface hierarchy"
          description="Compare neutral sections, emphasized cards, and progressive disclosure in one place."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
            <StorybookCard title="Paper" subtitle="default section shell">
              <Paper style={{ padding: 20, minHeight: 180 }}>
                <StorybookStack gap={10}>
                  <strong style={{ color: 'var(--ig-color-text-primary)' }}>General section</strong>
                  <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                    Use `Paper` when content needs a reusable section shell without becoming the dominant visual emphasis.
                  </div>
                </StorybookStack>
              </Paper>
            </StorybookCard>

            <StorybookCard title="Card" subtitle="highlighted content block">
              <Card style={{ padding: 20, minHeight: 180 }}>
                <StorybookStack gap={12}>
                  <div style={{ fontSize: 12, color: 'var(--ig-color-text-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Highlight card
                  </div>
                  <strong style={{ fontSize: 18, color: 'var(--ig-color-text-primary)' }}>Design System Status</strong>
                  <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                    Use `Card` for emphasized summaries, onboarding blocks, or module-level content that should stand above normal panels.
                  </div>
                </StorybookStack>
              </Card>
            </StorybookCard>

            <StorybookCard title="Accordion" subtitle="progressive disclosure">
              <StorybookStack gap={12}>
                <Accordion open>
                  <summary>What belongs in `@ingradient/ui`?</summary>
                  <div>Reusable primitives, components, and patterns that do not depend on API responses or product routing.</div>
                </Accordion>
                <Accordion>
                  <summary>What stays outside the package?</summary>
                  <div>Page-specific orchestration, domain rules, and product-only workflows remain in the consumer app layer.</div>
                </Accordion>
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Tabbed card composition"
          description="Tabs should provide the movement and selection behavior. The card remains only the surface shell."
        >
          <Card style={{ padding: 20 }}>
            <StorybookStack gap={16}>
              <Tabs
                items={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'usage', label: 'Usage' },
                  { value: 'api', label: 'API' },
                ]}
                value={tab}
                onChange={setTab}
              />
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                {tab === 'overview' && 'Card stays present while Tabs handle module navigation inside the same surface.'}
                {tab === 'usage' && 'Use card + tabs for highlighted modules, not for every ordinary content region.'}
                {tab === 'api' && 'Keep the content generic here. Product-specific orchestration belongs in page stories.'}
              </div>
            </StorybookStack>
          </Card>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
