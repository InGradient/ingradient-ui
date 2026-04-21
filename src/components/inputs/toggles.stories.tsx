import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, Radio, Switch } from './toggles'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/Checkbox And Switch',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    checked: false,
    onChange: () => undefined,
  },
  render: () => {
    const [checked, setChecked] = React.useState(true)
    const [switchOn, setSwitchOn] = React.useState(false)
    const [radio, setRadio] = React.useState('review')

    return (
      <StorybookPage
        title="Checkbox And Switch"
        description="Boolean controls need their own review surface because semantics matter as much as styling. Use Checkbox for selection and Switch for immediate settings."
      >
        <StorybookSection
          title="Boolean controls review"
          description="Compare checkbox, radio, and switch semantics together."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
            <StorybookCard title="Checkbox" subtitle="selection and partial selection">
              <StorybookStack gap={12}>
                <Checkbox
                  label="Include archived workspaces"
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
                <Checkbox label="Partially applied filter" indeterminate />
                <Checkbox label="Disabled option" disabled />
              </StorybookStack>
            </StorybookCard>

            <StorybookCard title="Switch" subtitle="immediate setting toggle">
              <StorybookStack gap={12}>
                <Switch
                  label={`Live sync ${switchOn ? 'enabled' : 'disabled'}`}
                  checked={switchOn}
                  onChange={(event) => setSwitchOn(event.currentTarget.checked)}
                />
                <Switch label="Readonly state" checked disabled />
              </StorybookStack>
            </StorybookCard>

            <StorybookCard title="Radio" subtitle="exclusive selection">
              <StorybookStack gap={12}>
                <Radio
                  name="role"
                  label="Reviewer"
                  checked={radio === 'review'}
                  onChange={() => setRadio('review')}
                />
                <Radio
                  name="role"
                  label="Editor"
                  checked={radio === 'edit'}
                  onChange={() => setRadio('edit')}
                />
                <Radio
                  name="role"
                  label="Owner"
                  checked={radio === 'owner'}
                  onChange={() => setRadio('owner')}
                />
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
