import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormGroup } from './form-group'
import { FieldRow } from '../../components/inputs/form-section'
import { TextField } from '../../components/inputs/text-fields'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Forms/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof FormGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { children: null },
  render: () => (
    <StorybookPage
      title="FormGroup"
      description="Composition wrapper for a labeled form section (title + description + children). Compose with FieldRow atoms from components/inputs."
    >
      <StorybookSection title="Variants" description="Title + description, title only, no header.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="With title + description">
            <FormGroup
              title="Connection settings"
              description="Configure how this device connects to the platform."
            >
              <FieldRow label="Server URL" hint="Including https://">
                <TextField size="sm" defaultValue="https://platform.example.com" aria-label="Server URL" />
              </FieldRow>
              <FieldRow label="API Key">
                <TextField size="sm" type="password" defaultValue="********" aria-label="API Key" />
              </FieldRow>
            </FormGroup>
          </StorybookCard>
          <StorybookCard title="Title only">
            <FormGroup title="General">
              <FieldRow label="Workspace name">
                <TextField size="sm" defaultValue="My Workspace" aria-label="Workspace name" />
              </FieldRow>
            </FormGroup>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
