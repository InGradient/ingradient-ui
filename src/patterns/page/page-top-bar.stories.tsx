import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageTopBar } from './page-top-bar'
import { Button } from '../../components/inputs/button'

const meta: Meta<typeof PageTopBar> = {
  title: 'Patterns/PageTopBar',
  component: PageTopBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = { args: { title: 'Catalog' } }
export const WithSubtitle: Story = {
  args: { title: 'Catalog', subtitle: 'Organize datasets and review labeled images' },
}
export const WithRightSlot: Story = {
  args: {
    title: 'Catalog',
    subtitle: 'Organize datasets and review labeled images',
    rightSlot: <>
      <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>Project · Wafer-2026</span>
      <Button variant="secondary" size="sm">Switch project</Button>
    </>,
  },
}
