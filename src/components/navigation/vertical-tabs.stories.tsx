import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { VerticalTabs } from './vertical-tabs'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Navigation/VerticalTabs',
  component: VerticalTabs,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'radio', options: ['default', 'settings'], description: 'Default animated rail, or filled settings navigation shared by Platform and Edge. Settings fixes item radius to small; shell dividers remain caller-owned.' },
  },
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

export const LinkedPanels: Story = {
  args: { items: baseItems, value: 'general', onChange: () => {} },
  render: () => {
    const [value, setValue] = React.useState('general')
    const id = React.useId()
    const items = baseItems.map((item) => ({ ...item, id: `${id}-${item.value}`, panelId: `${id}-${item.value}-panel` }))
    return <><VerticalTabs items={items} value={value} onChange={setValue} />{items.map((item) => <div key={item.value} role="tabpanel" id={item.panelId} aria-labelledby={item.id} hidden={value !== item.value}>{item.label} controls</div>)}</>
  },
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole('tab', { name: /general/i })
    await expect(first).toHaveAttribute('aria-controls', canvas.getByRole('tabpanel').id)
    first.focus()
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tabpanel', { name: 'Advanced' })).toBeVisible()
  },
}

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

export const SettingsAppearance: Story = {
  args: { items: [...baseItems, { value: 'billing', label: 'Billing', disabled: true }], value: 'general', appearance: 'settings', onChange: () => {} },
  parameters: { docs: { description: { story: 'Shared filled settings appearance: XL token row height, small item radius, semantic selected/hover colors, no animated rail. Platform and Edge use this variant without item CSS overrides.' } } },
  render: (args) => {
    const [value, setValue] = React.useState(args.value)
    return <div style={{ maxWidth: 'var(--ig-popup-md)' }}><VerticalTabs {...args} value={value} onChange={setValue} /></div>
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('tablist')).toHaveAttribute('data-appearance', 'settings')
    canvas.getByRole('tab', { name: /general/i }).focus()
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Advanced' })).toHaveFocus())
    await expect(canvas.getByRole('tab', { name: 'Billing' })).toBeDisabled()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(canvas.getByRole('tab', { name: /general/i })).toHaveFocus())
    await expect(canvas.getByRole('tab', { name: /general/i })).toHaveAttribute('aria-selected', 'true')
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
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm-narrow), 1fr))">
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
