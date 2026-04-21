import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VerticalTabs } from '../navigation'
import { Button } from '../inputs/button'
import { SettingsDialog } from './settings-dialog'
import { StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/SettingsDialog',
  component: SettingsDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    title: 'Workspace settings',
    children: null,
    onClose: () => undefined,
  },
} satisfies Meta<typeof SettingsDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => {
    const [tab, setTab] = React.useState('general')

    return (
      <StorybookPage
        title="SettingsDialog"
        description="SettingsDialog is the opinionated modal shell for sidebar-plus-editor settings flows. Use it when a normal dialog is too small but a full page is too heavy."
      >
        <StorybookSection
          title="Dialog review"
          description="Review sidebar navigation, main editor rhythm, and dismiss behavior together."
        >
          <SettingsDialog
            title="Workspace settings"
            onClose={() => undefined}
            sidebar={
              <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <VerticalTabs
                  items={[
                    { value: 'general', label: 'General' },
                    { value: 'members', label: 'Members', badge: '4' },
                    { value: 'notifications', label: 'Notifications' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  value={tab}
                  onChange={setTab}
                  radius="sm"
                />
              </div>
            }
          >
            <StorybookStack gap={16}>
              <div style={{ color: 'var(--ig-color-text-primary)', fontSize: 18, fontWeight: 700 }}>
                {tab === 'general' && 'General settings'}
                {tab === 'members' && 'Member permissions'}
                {tab === 'notifications' && 'Notification rules'}
                {tab === 'advanced' && 'Advanced controls'}
              </div>
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                Use SettingsDialog for compact settings flows that still need stable left navigation and a larger editing surface.
              </div>
              <input
                defaultValue="Quality Review Workspace"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--ig-color-border-subtle)',
                  background: 'var(--ig-color-surface-panel)',
                  color: 'var(--ig-color-text-primary)',
                }}
              />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="secondary">Cancel</Button>
                <Button variant="accent">Save changes</Button>
              </div>
            </StorybookStack>
          </SettingsDialog>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
