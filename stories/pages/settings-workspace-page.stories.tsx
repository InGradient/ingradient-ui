import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppShell,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
  Panel,
  PanelHeader,
  PanelHint,
  PanelTitle,
  TopBar,
  SplitLayout,
} from '@ingradient/ui/patterns'
import { Alert, Button, SearchField, SelectField, VerticalTabs } from '@ingradient/ui/components'
import { Badge } from '../../src/components/feedback/badge'
import { SectionPanel } from '../../src/components/data-display'
import { StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Pages/Settings Workspace',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const settingsTabs = [
  { value: 'general', label: 'General' },
  { value: 'permissions', label: 'Permissions', badge: '4' },
  { value: 'integrations', label: 'Integrations', badge: '2' },
  { value: 'advanced', label: 'Advanced' },
]

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ig-color-text-muted)' }}>{label}</label>
      {children}
      {hint ? <span style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{hint}</span> : null}
    </div>
  )
}

function SettingsWorkspacePage() {
  const [tab, setTab] = React.useState('permissions')
  const [query, setQuery] = React.useState('')
  const [role, setRole] = React.useState('reviewer')

  return (
    <AppShell style={{ minHeight: 900 }}>
      <TopBar>
        <div style={{ fontWeight: 700, color: 'var(--ig-color-text-primary)' }}>Ingradient UI Workspace</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Badge $tone="accent">Settings</Badge>
          <Button variant="secondary">Open Docs</Button>
          <Button variant="accent">Publish</Button>
        </div>
      </TopBar>
      <PageHeader>
        <PageHeaderRow>
          <PageTitleBlock>
            <PageTitle>Settings Workspace</PageTitle>
            <PageSubtitle>
              Workspace-level story for settings navigation, editor content, and right-side supporting context.
            </PageSubtitle>
          </PageTitleBlock>
          <Button variant="secondary">Discard changes</Button>
        </PageHeaderRow>
      </PageHeader>
      <PageContent>
        <Alert $tone="info">
          This page story replaces the old live example for settings and inspector composition. Review layout, density, and empty/supporting content here.
        </Alert>
        <SplitLayout
          sidebar={
            <Panel>
              <PanelHeader>
                <PanelTitle>Workspace settings</PanelTitle>
                <PanelHint>stable left rail</PanelHint>
              </PanelHeader>
              <div style={{ padding: 18 }}>
                <VerticalTabs items={settingsTabs} value={tab} onChange={setTab} />
              </div>
            </Panel>
          }
          content={
            <Panel>
              <PanelHeader>
                <PanelTitle>{settingsTabs.find((item) => item.value === tab)?.label ?? 'Settings'}</PanelTitle>
                <PanelHint>editable content</PanelHint>
              </PanelHeader>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: 12 }}>
                  <SearchField
                    placeholder="Filter fields"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onClear={() => setQuery('')}
                  />
                  <SelectField value={role} onChange={(event) => setRole(event.target.value)}>
                    <option value="reviewer">Reviewer</option>
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </SelectField>
                </div>
                <SectionPanel>
                  <StorybookStack gap={16}>
                    <FieldBlock label="Workspace name" hint="Visible to downstream consumer apps and review portals.">
                      <input
                        defaultValue="Quality Review Portal"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 12,
                          border: '1px solid var(--ig-color-border-subtle)',
                          background: 'var(--ig-color-surface-muted)',
                          color: 'var(--ig-color-text-primary)',
                        }}
                      />
                    </FieldBlock>
                    <FieldBlock label="Default permission role" hint="Changes here only affect new members.">
                      <SelectField value={role} onChange={(event) => setRole(event.target.value)}>
                        <option value="reviewer">Reviewer</option>
                        <option value="editor">Editor</option>
                        <option value="owner">Owner</option>
                      </SelectField>
                    </FieldBlock>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Button variant="secondary">Reset</Button>
                      <Button variant="accent">Save changes</Button>
                    </div>
                  </StorybookStack>
                </SectionPanel>
              </div>
            </Panel>
          }
          inspector={
            <StorybookStack gap={16}>
              <SectionPanel>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <strong style={{ color: 'var(--ig-color-text-primary)' }}>Inspector</strong>
                  <Badge>Live</Badge>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                  Role preview: <strong>{role}</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  Use the inspector for metadata, warnings, rollout state, or secondary actions rather than for the main edit form.
                </div>
              </SectionPanel>
              <SectionPanel>
                <strong style={{ color: 'var(--ig-color-text-primary)' }}>Review checklist</strong>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ig-color-text-secondary)' }}>
                  <li>Left navigation remains stable</li>
                  <li>Main editor owns the primary workflow</li>
                  <li>Inspector stays secondary and compact</li>
                </ul>
              </SectionPanel>
            </StorybookStack>
          }
        />
      </PageContent>
    </AppShell>
  )
}

export const Review: Story = {
  render: () => <SettingsWorkspacePage />,
}
