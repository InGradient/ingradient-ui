import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button, type ButtonProps } from './button'
import { buildButtonLabel, type ContentLength } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

type ButtonStoryArgs = ButtonProps & {
  contentLength: ContentLength
  intent: 'primary' | 'supporting' | 'critical'
}

function resolveButtonProps(args: ButtonStoryArgs): ButtonProps {
  const {
    contentLength,
    intent,
    children: _children,
    ...buttonProps
  } = args
  const intentMap = {
    primary: { variant: 'solid', tone: 'default' },
    supporting: { variant: 'secondary', tone: 'default' },
    critical: { variant: 'secondary', tone: 'danger' },
  } as const

  return {
    ...buttonProps,
    ...intentMap[intent],
    children: buildButtonLabel(contentLength),
  }
}

const meta = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    contentLength: 'short',
    intent: 'primary',
    size: 'md',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    contentLength: {
      control: 'inline-radio',
      options: ['short', 'long'],
      description: 'Semantic copy preset for designer review.',
    },
    intent: {
      control: 'inline-radio',
      options: ['primary', 'supporting', 'critical'],
      description: 'High-level action meaning that maps to variant and tone.',
    },
    children: {
      control: false,
      table: { disable: true },
    },
    variant: {
      control: false,
      table: { disable: true },
    },
    tone: {
      control: false,
      table: { disable: true },
    },
  },
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<ButtonStoryArgs>

export default meta

type Story = StoryObj<typeof meta>
type ButtonStory = StoryObj<ButtonStoryArgs>

export const Playground: ButtonStory = {
  render: (args) => <Button {...resolveButtonProps(args)} />,
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: buildButtonLabel(args.contentLength) }))
    await expect(args.onClick).toHaveBeenCalled()
  },
}

export const Review: ButtonStory = {
  render: (args) => (
    <StorybookPage
      title="Button"
      description="Buttons should be reviewed by action meaning first. Designers should choose the intent and copy length, then only drop to raw props if a precise edge case needs inspection."
      meta={
        <StorybookMetaBar
          items={[
            { label: 'stable', tone: 'success' },
            { label: 'consumer-verified', tone: 'accent' },
            { label: 'mobile-reviewed', tone: 'warning' },
          ]}
        />
      }
    >
      <StorybookSection
        title="Intent matrix"
        description="Compare primary, supporting, and critical actions before discussing low-level variant names."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
          <StorybookCard title="Action priority" subtitle="semantic intent first">
            <StorybookStack gap={12}>
              <Button {...resolveButtonProps({ ...args, intent: 'primary', contentLength: 'short' })} />
              <Button {...resolveButtonProps({ ...args, intent: 'supporting', contentLength: 'short' })} />
              <Button {...resolveButtonProps({ ...args, intent: 'critical', contentLength: 'short' })}>
                Delete item
              </Button>
            </StorybookStack>
          </StorybookCard>
          <StorybookCard title="Copy length" subtitle="short and long labels remain legible">
            <StorybookStack gap={12}>
              <Button {...resolveButtonProps({ ...args, intent: 'primary', contentLength: 'short' })} />
              <Button {...resolveButtonProps({ ...args, intent: 'primary', contentLength: 'long' })} />
            </StorybookStack>
          </StorybookCard>
          <StorybookCard title="Density scale" subtitle="same meaning, tighter or looser layout">
            <StorybookStack gap={12}>
              <Button {...resolveButtonProps({ ...args, size: 'sm', intent: 'supporting', contentLength: 'short' })} />
              <Button {...resolveButtonProps({ ...args, size: 'md', intent: 'supporting', contentLength: 'short' })} />
              <Button {...resolveButtonProps({ ...args, size: 'lg', intent: 'supporting', contentLength: 'short' })} />
            </StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
