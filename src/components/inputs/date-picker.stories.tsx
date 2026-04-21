import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePickerField } from './date-picker'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/DatePickerField',
  component: DatePickerField,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    value: '',
    onChange: () => undefined,
  },
} satisfies Meta<typeof DatePickerField>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => {
    const [value, setValue] = React.useState('2026-04-21')

    return (
      <StorybookPage
        title="DatePickerField"
        description="DatePickerField is the reusable calendar-triggered date input for forms and filters. Review selection, placeholder, and disabled behavior here."
      >
        <StorybookSection
          title="Selection review"
          description="Open the calendar, select a date, and compare default and disabled usage in one place."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="Interactive picker" subtitle="controlled value">
              <StorybookStack gap={12}>
                <DatePickerField value={value} onChange={setValue} />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                  Selected date: <strong>{value || 'none'}</strong>
                </div>
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  Use for filter bars, expiration dates, and settings forms where a custom calendar is preferred over the native date input.
                </div>
              </StorybookStack>
            </StorybookCard>
            <StorybookCard title="Idle and disabled" subtitle="placeholder states">
              <StorybookStack gap={12}>
                <DatePickerField value="" onChange={() => undefined} placeholder="Pick review date" />
                <DatePickerField value="2026-04-30" onChange={() => undefined} disabled />
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
