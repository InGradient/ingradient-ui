import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordField, TextareaField, TextField } from './text-fields'
import { buildTextFieldCopy, type ContentLength, type ValidationState } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

type TextFieldStoryArgs = React.ComponentProps<typeof TextField> & {
  contentLength: ContentLength
  validationState: ValidationState
  showHelperText: boolean
}

const meta = {
  title: 'Components/Inputs/Text Fields',
  component: TextField as unknown as React.ComponentType<TextFieldStoryArgs>,
  tags: ['autodocs'],
  args: {
    contentLength: 'short',
    validationState: 'none',
    showHelperText: true,
    disabled: false,
  },
  argTypes: {
    contentLength: {
      control: 'inline-radio',
      options: ['short', 'long'],
    },
    validationState: {
      control: 'inline-radio',
      options: ['none', 'warning', 'error', 'success'],
    },
    showHelperText: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<TextFieldStoryArgs>

export default meta

type Story = StoryObj<TextFieldStoryArgs>

export const Playground: Story = {
  render: (args) => {
    const copy = buildTextFieldCopy(args.validationState, args.contentLength)
    const [value, setValue] = React.useState(copy.titleValue)

    return (
      <StorybookStack gap={10}>
        <TextField
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={copy.placeholder}
          disabled={args.disabled}
          aria-invalid={args.validationState === 'error'}
        />
        {args.showHelperText ? (
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>{copy.helperText}</div>
        ) : null}
      </StorybookStack>
    )
  },
}

export const Review: Story = {
  render: (args) => {
    const copy = buildTextFieldCopy(args.validationState, args.contentLength)
    const [value, setValue] = React.useState(copy.titleValue)
    const [notes, setNotes] = React.useState(copy.notesValue)

    return (
      <StorybookPage
        title="Text Field Family"
        description="TextField, TextareaField, and PasswordField share the same control contract and should be reviewed as one family, not as unrelated custom inputs."
        meta={
          <StorybookMetaBar
            items={[
              { label: 'stable', tone: 'success' },
              { label: 'a11y-critical', tone: 'warning' },
              { label: 'consumer-verified', tone: 'accent' },
            ]}
          />
        }
      >
        <StorybookSection
          title="Field family review"
          description="Compare single-line, multiline, and password inputs with the same visual language and the same semantic validation state."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="TextField" subtitle="single-line input">
              <StorybookStack gap={12}>
                <TextField
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={copy.placeholder}
                  disabled={args.disabled}
                  aria-invalid={args.validationState === 'error'}
                />
                {args.showHelperText ? (
                  <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>{copy.helperText}</div>
                ) : null}
                <TextField placeholder="Disabled input" disabled aria-disabled />
              </StorybookStack>
            </StorybookCard>

            <StorybookCard title="TextareaField" subtitle="longer copy and notes">
              <StorybookStack gap={12}>
                <TextareaField
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add review notes"
                  aria-invalid={args.validationState === 'error'}
                />
                {args.showHelperText ? (
                  <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>{copy.helperText}</div>
                ) : null}
              </StorybookStack>
            </StorybookCard>

            <StorybookCard title="PasswordField" subtitle="sensitive value input">
              <StorybookStack gap={12}>
                <PasswordField defaultValue="secure-passphrase" disabled={args.disabled} aria-invalid={args.validationState === 'error'} />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  Use password input when the field behavior is sensitive, not just because the content is important.
                </div>
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
