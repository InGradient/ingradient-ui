import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { NumberField } from './number-field'
import { StorybookCard, StorybookGrid, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    value: 25,
    onChange: () => undefined,
    min: 0,
    max: 100,
    step: 5,
    placeholder: '0',
    'aria-label': 'Numeric value',
  },
} satisfies Meta<typeof NumberField>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(25)

    return <NumberField {...args} value={value} onChange={setValue} />
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox')

    await userEvent.clear(input)
    await userEvent.type(input, '40{enter}')
    await expect(input).toHaveValue('40')
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await expect(input).toHaveValue('45')
  },
}

export const Review: Story = {
  render: (args) => {
    const [zoom, setZoom] = React.useState(100)
    const [opacity, setOpacity] = React.useState(40)
    const [temperature, setTemperature] = React.useState(37.2)

    return (
      <StorybookGrid columns="repeat(auto-fit, minmax(240px, 1fr))">
        <StorybookCard title="Integer step" subtitle="기본 spinner 입력">
          <NumberField {...args} aria-label="Zoom level" value={zoom} onChange={setZoom} />
        </StorybookCard>
        <StorybookCard title="Small range" subtitle="좁은 범위를 조절하는 입력">
          <NumberField
            aria-label="Layer opacity"
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={100}
            step={1}
          />
        </StorybookCard>
        <StorybookCard title="Formatted" subtitle="표시 형식과 실제 값을 분리할 때">
          <StorybookStack>
            <NumberField
              aria-label="Surface temperature"
              value={temperature}
              onChange={setTemperature}
              min={35}
              max={42}
              step={0.1}
              format={(value) => `${value.toFixed(1)}°C`}
              parse={(value) => Number.parseFloat(value.replace('°C', '').trim())}
            />
          </StorybookStack>
        </StorybookCard>
      </StorybookGrid>
    )
  },
}
