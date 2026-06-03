import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VerticalTabs } from '../../components/navigation'
import { Button } from '../../components/inputs/button'
import { SettingsDialog } from './settings-dialog'
import { StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Dialogs/SettingsDialog',
  component: SettingsDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
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
              <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-5)' }}>
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
              <div style={{ color: 'var(--ig-color-text-primary)', fontSize: 18, fontWeight: 'var(--ig-font-weight-bold)' }}>
                {tab === 'general' && 'General settings'}
                {tab === 'members' && 'Member permissions'}
                {tab === 'notifications' && 'Notification rules'}
                {tab === 'advanced' && 'Advanced controls'}
              </div>
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                Use SettingsDialog for compact settings flows that still need stable left navigation and a larger editing surface.
              </div>
              <input
                aria-label="Workspace name"
                defaultValue="Quality Review Workspace"
                style={{
                  width: '100%',
                  padding: 'var(--ig-space-5) var(--ig-space-6)',
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
