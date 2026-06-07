import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldRow, FormField } from './form-section'
import { TextField } from './text-fields'
import { Switch } from './toggles'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/FieldRow & FormField',
  component: FieldRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof FieldRow>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { label: '', children: null },
  render: () => (
    <StorybookPage
      title="FieldRow & FormField"
      description="Atomic form structure helpers. FieldRow lays out a single label + input pair (2-col grid) with optional hint. FormField stacks an uppercase label above its child vertically."
    >
      <StorybookSection title="FieldRow" description="2-col grid (label / content). Collapses to single column on mobile.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Variants">
            <FieldRow label="Email" htmlFor="email" hint="We won't share this.">
              <TextField id="email" size="sm" defaultValue="user@example.com" />
            </FieldRow>
            <FieldRow label="Notifications">
              <Switch defaultChecked aria-label="Notifications" />
            </FieldRow>
            <FieldRow label="Description (no hint)">
              <TextField size="sm" placeholder="Optional description" aria-label="Description" />
            </FieldRow>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="FormField" description="Vertical label + child. Uppercase muted label for compact forms.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs-plus), 1fr))">
          <StorybookCard title="Single field">
            <FormField label="Workspace name">
              <TextField size="sm" defaultValue="My Workspace" aria-label="Workspace name" />
            </FormField>
          </StorybookCard>
          <StorybookCard title="With switch">
            <FormField label="Enable notifications">
              <Switch defaultChecked aria-label="Enable notifications" />
            </FormField>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
