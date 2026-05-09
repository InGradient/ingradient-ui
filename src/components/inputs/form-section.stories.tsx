import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldRow, FormGroup } from './form-section'
import { TextField } from './text-fields'
import { Switch } from './toggles'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/FormGroup & FieldRow',
  component: FormGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof FormGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { children: null },
  render: () => (
    <StorybookPage
      title="FormGroup & FieldRow"
      description="Form structure helpers. FormGroup wraps a labeled section (title + description + children). FieldRow lays out a single label + input pair with optional hint."
    >
      <StorybookSection title="FormGroup" description="Section with title + description.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="With title + description">
            <FormGroup
              title="Connection settings"
              description="Configure how this device connects to the platform."
            >
              <FieldRow label="Server URL" hint="Including https://">
                <TextField size="sm" defaultValue="https://platform.example.com" />
              </FieldRow>
              <FieldRow label="API Key">
                <TextField size="sm" type="password" defaultValue="********" />
              </FieldRow>
            </FormGroup>
          </StorybookCard>
          <StorybookCard title="Title only">
            <FormGroup title="General">
              <FieldRow label="Workspace name">
                <TextField size="sm" defaultValue="My Workspace" />
              </FieldRow>
            </FormGroup>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="FieldRow" description="Single label/input with optional hint.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Variants">
            <FieldRow label="Email" htmlFor="email" hint="We won't share this.">
              <TextField id="email" size="sm" defaultValue="user@example.com" />
            </FieldRow>
            <FieldRow label="Notifications">
              <Switch defaultChecked />
            </FieldRow>
            <FieldRow label="Description (no hint)">
              <TextField size="sm" placeholder="Optional description" />
            </FieldRow>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
