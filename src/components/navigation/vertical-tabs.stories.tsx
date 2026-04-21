import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { VerticalTabs } from './vertical-tabs'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Navigation/VerticalTabs',
  component: VerticalTabs,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof VerticalTabs>

export default meta

type Story = StoryObj<typeof meta>

const baseItems = [
  { value: 'general', label: 'General', badge: '12' },
  { value: 'permissions', label: 'Permissions', badge: '4' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'advanced', label: 'Advanced' },
]

export const Playground: Story = {
  args: {
    items: baseItems,
    value: 'general',
    onChange: () => undefined,
  },
  render: () => {
    const [value, setValue] = React.useState('general')

    return (
      <div style={{ maxWidth: 320 }}>
        <VerticalTabs items={baseItems} value={value} onChange={setValue} />
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const tab = canvas.getByRole('tab', { name: /general/i })
    tab.focus()
    await userEvent.keyboard('{ArrowDown}')
    const permissionsTab = canvas.getByRole('tab', { name: /permissions/i })
    await waitFor(async () => {
      await expect(permissionsTab).toHaveFocus()
      await expect(permissionsTab).toHaveAttribute('aria-selected', 'true')
    })
  },
}

export const Review: Story = {
  args: {
    items: baseItems,
    value: 'general',
    onChange: () => undefined,
  },
  render: () => {
    const [primaryValue, setPrimaryValue] = React.useState('general')
    const [compactValue, setCompactValue] = React.useState('notifications')

    return (
      <StorybookPage
        title="Vertical Tabs"
        description="Use vertical tabs for settings and inspector navigation where the left rail changes content within the same screen."
      >
        <StorybookSection
          title="Navigation review"
          description="Compare the same tab family in a default and compact radius context."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
            <StorybookCard title="Default radius" subtitle="settings shell style">
              <VerticalTabs items={baseItems} value={primaryValue} onChange={setPrimaryValue} />
            </StorybookCard>
            <StorybookCard title="Compact radius" subtitle="tighter inspector navigation">
              <VerticalTabs
                items={[
                  ...baseItems,
                  { value: 'billing', label: 'Billing', disabled: true },
                ]}
                value={compactValue}
                onChange={setCompactValue}
                radius="sm"
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
