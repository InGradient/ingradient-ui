import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './slider'

const meta = {
  title: 'Components/Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { min: 0, max: 100, step: 5, defaultValue: 70, 'aria-label': 'Volume' },
}

/** 단위는 소비자가 붙인다 — 화면마다 %·ms·배율로 다르다. */
export const WithValueLabel: Story = {
  args: { ...Default.args, valueLabel: '70%' },
}

export const Disabled: Story = {
  args: { ...Default.args, valueLabel: '70%', disabled: true },
}
