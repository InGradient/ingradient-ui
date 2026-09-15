import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusIcon, type StatusKind } from './status-icon'
import { Inline } from '../../primitives'

const meta = {
  title: 'Components/Feedback/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = { args: { status: 'success' } }

/** 한 화면에서 여러 상태가 같이 보이는 경우가 많다 — 심각도가 색으로 구분돼야 한다. */
export const AllStates: Story = {
  args: { status: 'success' },
  render: () => (
    <Inline gap="var(--ig-space-4)" align="center">
      {(['success', 'warning', 'failed', 'running', 'skipped', 'unknown', 'pending'] as StatusKind[])
        .map((status) => <StatusIcon key={status} status={status} />)}
    </Inline>
  ),
}
