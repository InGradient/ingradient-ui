import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingRow } from './setting-row'
import { Slider } from '../inputs/slider'
import { Switch } from '../inputs/toggles'

const meta = {
  title: 'Components/DataDisplay/SettingRow',
  component: SettingRow,
  tags: ['autodocs'],
} satisfies Meta<typeof SettingRow>

export default meta
type Story = StoryObj<typeof meta>

export const WithSwitch: Story = {
  args: {
    label: '소리',
    description: '촬영이 끝나면 알림음을 낸다',
    control: <Switch checked aria-label="소리" onChange={() => undefined} />,
  },
}

export const WithSlider: Story = {
  args: {
    label: '음량',
    description: '알림음 크기',
    control: <Slider min={0} max={100} step={5} defaultValue={70} valueLabel="70%" aria-label="음량" />,
  },
}

/** 설명이 없으면 이름만 남는다. */
export const LabelOnly: Story = {
  args: { label: '채널 1', control: <Switch aria-label="채널 1" onChange={() => undefined} /> },
}
