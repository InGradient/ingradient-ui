import type { Meta, StoryObj } from '@storybook/react-vite'
import { TitleBarView, type TitleBarLabels } from '@ingradient/edge-pages'

const LABELS: TitleBarLabels = {
  appName: 'Ingradient Edge',
  minimize: '최소화',
  maximize: '최대화',
  restore: '복원',
  close: '닫기',
}

function TitleBarScene(args: { isMaximized?: boolean }) {
  return (
    <TitleBarView
      isMaximized={args.isMaximized ?? false}
      labels={LABELS}
      onMinimize={() => undefined}
      onMaximize={() => undefined}
      onClose={() => undefined}
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Chrome/TitleBar',
  component: TitleBarScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TitleBarScene>

export default meta

type Story = StoryObj<typeof meta>

export const Normal: Story = { args: { isMaximized: false } }
export const Maximized: Story = { args: { isMaximized: true } }
