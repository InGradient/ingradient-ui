import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Breadcrumbs } from './breadcrumbs'
import { Pagination } from './pagination'
import { Stepper } from './stepper'
import { Tabs } from './tabs'
import { VerticalTabs } from './vertical-tabs'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const breadcrumbItems = [
  { label: 'Workspace', href: '#' },
  { label: 'Review queue', href: '#' },
  { label: 'Batch 24A' },
]

const tabItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'permissions', label: 'Permissions' },
]

const verticalItems = [
  { value: 'general', label: 'General', badge: '12' },
  { value: 'members', label: 'Members', badge: '4' },
  { value: 'api', label: 'API access' },
  { value: 'advanced', label: 'Advanced' },
]

const meta = {
  title: 'Components/Navigation/Navigation Family',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

function NavigationFamilyDemo() {
  const [page, setPage] = React.useState(2)
  const [tabValue, setTabValue] = React.useState('activity')
  const [verticalValue, setVerticalValue] = React.useState('members')
  const [activeStep, setActiveStep] = React.useState(1)

  return (
    <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
      <StorybookCard title="Breadcrumbs" subtitle="location context">
        <StorybookStack gap={14}>
          <Breadcrumbs items={breadcrumbItems} />
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Use breadcrumbs for hierarchical location, not for in-page mode switching.
          </div>
        </StorybookStack>
      </StorybookCard>

      <StorybookCard title="Tabs and Pagination" subtitle="section switch + paged list">
        <StorybookStack gap={14}>
          <Tabs items={tabItems} value={tabValue} onChange={setTabValue} variant="underline" />
          <Pagination page={page} totalPages={5} onChange={setPage} />
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Current state: tab <strong>{tabValue}</strong>, page <strong>{page}</strong>
          </div>
        </StorybookStack>
      </StorybookCard>

      <StorybookCard title="Stepper" subtitle="multi-step flow">
        <StorybookStack gap={14}>
          <Stepper
            steps={['Import', 'Annotate', 'Review', 'Publish']}
            activeStep={activeStep}
          />
          <Pagination page={activeStep + 1} totalPages={4} onChange={(value) => setActiveStep(value - 1)} />
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Use stepper for ordered progress, not for arbitrary page navigation.
          </div>
        </StorybookStack>
      </StorybookCard>

      <StorybookCard title="VerticalTabs" subtitle="settings and inspector rail">
        <StorybookStack gap={14}>
          <VerticalTabs items={verticalItems} value={verticalValue} onChange={setVerticalValue} />
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            This family already has dedicated stories. Keep this card as the top-level comparison surface.
          </div>
        </StorybookStack>
      </StorybookCard>
    </StorybookGrid>
  )
}

export const Review: Story = {
  args: {
    items: breadcrumbItems,
  },
  render: () => (
    <StorybookPage
      title="Navigation Family"
      description="Navigation should be reviewed as a family. Breadcrumbs, tabs, pagination, stepper, and vertical tabs each solve different movement problems and should not be used interchangeably."
    >
      <StorybookSection
        title="Wayfinding surfaces"
        description="Compare hierarchical location, lateral section switching, step progression, and settings rail navigation in one place."
      >
        <NavigationFamilyDemo />
      </StorybookSection>
    </StorybookPage>
  ),
  play: async ({ canvas, userEvent }) => {
    const pageFourButtons = canvas.getAllByRole('button', { name: '4' })
    await userEvent.click(pageFourButtons[0])
    await expect(pageFourButtons[0]).toBeInTheDocument()
  },
}
