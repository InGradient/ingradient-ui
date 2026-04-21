import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Checkbox, SelectField, Switch, TextField, TextareaField } from '../../src/components'
import { FieldGroup, FieldHint, FieldLabel, FormSection } from '../../src/patterns'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Form Sections',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function BasicSectionDemo() {
  const [name, setName] = React.useState('Operations workspace')
  const [description, setDescription] = React.useState('Workspace metadata used across exports and review flows.')

  return (
    <FormSection>
      <div>
        <h3 style={{ margin: 0, fontSize: 'var(--ig-font-size-lg)' }}>General Settings</h3>
        <p style={{ margin: '8px 0 0', color: 'var(--ig-color-text-muted)', fontSize: '14px' }}>
          Group fields that are saved together and keep helper copy near the decision point.
        </p>
      </div>
      <StorybookStack gap={16}>
        <FieldGroup>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <TextField id="workspace-name" value={name} onChange={(event) => setName(event.target.value)} />
          <FieldHint>Used in exports, URLs, and review assignment screens.</FieldHint>
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="workspace-description">Description</FieldLabel>
          <TextareaField
            id="workspace-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
          <FieldHint>Keep this short so downstream consuming apps can surface it in compact cards.</FieldHint>
        </FieldGroup>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="secondary">Discard</Button>
          <Button variant="accent">Save changes</Button>
        </div>
      </StorybookStack>
    </FormSection>
  )
}

function PreferenceSectionDemo() {
  const [theme, setTheme] = React.useState('portalDark')
  const [autoAssign, setAutoAssign] = React.useState(true)
  const [includeArchived, setIncludeArchived] = React.useState(false)

  return (
    <FormSection>
      <div>
        <h3 style={{ margin: 0, fontSize: 'var(--ig-font-size-lg)' }}>Review Preferences</h3>
        <p style={{ margin: '8px 0 0', color: 'var(--ig-color-text-muted)', fontSize: '14px' }}>
          Settings-style form sections often mix text controls, selects, and toggles in the same save unit.
        </p>
      </div>
      <StorybookStack gap={16}>
        <FieldGroup>
          <FieldLabel htmlFor="review-theme">Workspace theme</FieldLabel>
          <SelectField id="review-theme" value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="portalDark">Portal Dark</option>
            <option value="portalLight">Portal Light</option>
            <option value="system">System</option>
          </SelectField>
          <FieldHint>Review this as a standard field block instead of inventing a custom card for each preference.</FieldHint>
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="auto-assign">Automation</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Switch
              id="auto-assign"
              checked={autoAssign}
              onChange={(event) => setAutoAssign(event.target.checked)}
              label="Auto-assign first available reviewer"
            />
            <Checkbox
              checked={includeArchived}
              onChange={(event) => setIncludeArchived(event.target.checked)}
              label="Include archived labels in quick filters"
            />
          </div>
        </FieldGroup>
      </StorybookStack>
    </FormSection>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Form Sections"
      description="FormSection is the reusable shell for grouped field editing. Review it outside specific pages so label rhythm, helper copy, and action layout stay consistent."
    >
      <StorybookSection
        title="Grouped form blocks"
        description="Compare a basic content form and a settings-style preference block before embedding them in pages or dialogs."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Content editing" subtitle="text-heavy block">
            <BasicSectionDemo />
          </StorybookCard>
          <StorybookCard title="Preferences" subtitle="mixed controls">
            <PreferenceSectionDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
