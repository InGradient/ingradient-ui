import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { DialogShell } from './dialog-shell'
import { Button } from '../inputs/button'
import { buildDialogScenario, type ReviewRole } from '@storybook-support/../builders/review-builders'
import { StorybookMetaBar, StorybookStack } from '@storybook-support/storybook-layout'

type DialogStoryArgs = React.ComponentProps<typeof DialogShell> & {
  scenario: 'publish' | 'destructive' | 'permissions'
}

const meta = {
  title: 'Components/Overlays/DialogShell',
  component: DialogShell as unknown as React.ComponentType<DialogStoryArgs>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    scenario: 'publish',
    onClose: () => undefined,
  },
  argTypes: {
    onClose: { action: 'closed' },
    scenario: {
      control: 'inline-radio',
      options: ['publish', 'destructive', 'permissions'],
    },
  },
} satisfies Meta<DialogStoryArgs>

export default meta

type Story = StoryObj<DialogStoryArgs>

export const Playground: Story = {
  render: (args, context) => {
    const role = (context.globals.role as ReviewRole | undefined) ?? 'editor'
    const scenario = buildDialogScenario(args.scenario, role)

    return (
      <DialogShell
        title={scenario.title}
        description={scenario.description}
        onClose={args.onClose}
        actions={
          <>
            <Button variant="secondary">{scenario.actions[0]}</Button>
            <Button tone={args.scenario === 'destructive' ? 'danger' : 'default'}>{scenario.actions[1]}</Button>
            {scenario.actions[2] ? <Button variant="accent">{scenario.actions[2]}</Button> : null}
          </>
        }
      >
        <StorybookStack gap={12}>
          <p style={{ margin: 0, color: 'var(--ig-color-text-secondary)' }}>
            Reviewers will be notified and a release note will be generated automatically.
          </p>
        </StorybookStack>
      </DialogShell>
    )
  },
}

export const Review: Story = {
  render: (args, context) => {
    const role = (context.globals.role as ReviewRole | undefined) ?? 'editor'
    const scenario = buildDialogScenario(args.scenario, role)

    return (
      <DialogShell
        title={scenario.title}
        description={scenario.description}
        width="min(560px, 100%)"
        onClose={args.onClose}
        children={
          <StorybookStack gap={12}>
            <StorybookMetaBar
              items={[
                { label: 'stable', tone: 'success' },
                { label: `${role} role`, tone: role === 'admin' ? 'accent' : 'neutral' },
                { label: args.scenario, tone: args.scenario === 'destructive' ? 'danger' : 'warning' },
              ]}
            />
            <div style={{ color: 'var(--ig-color-text-secondary)' }}>
              <strong style={{ display: 'block', marginBottom: 6, color: 'var(--ig-color-text-primary)' }}>
                Included changes
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>6 updated tokens</li>
                <li>3 component visual adjustments</li>
                <li>1 deprecated prop note</li>
              </ul>
            </div>
          </StorybookStack>
        }
        actions={
          <>
            <Button variant="secondary">{scenario.actions[0]}</Button>
            <Button tone={args.scenario === 'destructive' ? 'danger' : 'default'}>{scenario.actions[1]}</Button>
            {scenario.actions[2] ? <Button variant="accent">{scenario.actions[2]}</Button> : null}
          </>
        }
      />
    )
  },
}
