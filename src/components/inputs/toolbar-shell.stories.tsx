import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarShell, type ToolbarShellAction } from './toolbar-shell'
import { EraserIcon, PencilIcon, PointerIcon, RefreshIcon, TrashIcon } from '../icons/catalog-icons'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/ToolbarShell',
  component: ToolbarShell,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ToolbarShell>

export default meta

type Story = StoryObj<typeof meta>

const noop = () => {}

const ACTIONS: Array<ToolbarShellAction | 'separator'> = [
  { key: 'select', title: 'Select', icon: <PointerIcon />, active: true, onClick: noop },
  { key: 'draw', title: 'Draw', icon: <PencilIcon />, onClick: noop },
  { key: 'erase', title: 'Erase', icon: <EraserIcon />, onClick: noop },
  'separator',
  { key: 'delete', title: 'Delete', icon: <TrashIcon />, danger: true, onClick: noop },
  { key: 'reset', title: 'Reset', icon: <RefreshIcon />, disabled: true, onClick: noop },
]

export const Review: Story = {
  args: { actions: ACTIONS, ariaLabel: 'Canvas tools' },
  render: () => (
    <StorybookPage
      title="ToolbarShell"
      description="actions 배열 + optional trailing slot + 4-placement 의 범용 toolbar 컨테이너. active(토글)·danger·disabled 버튼 상태와 'separator' 구분자를 지원하고, placement 에 따라 가로/세로로 배치된다."
    >
      <StorybookSection title="버튼 상태" description="active 토글 / danger / disabled / separator 구분자.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="default" subtitle="가로 (bottom) · md">
            <ToolbarShell actions={ACTIONS} ariaLabel="Canvas tools default" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="placement" description="bottom/top 은 가로 row, left/right 는 세로 column.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="top" subtitle="가로 row">
            <ToolbarShell actions={ACTIONS} placement="top" ariaLabel="Canvas tools top" />
          </StorybookCard>
          <StorybookCard title="left" subtitle="세로 column">
            <ToolbarShell actions={ACTIONS} placement="left" ariaLabel="Canvas tools left" />
          </StorybookCard>
          <StorybookCard title="right" subtitle="세로 column">
            <ToolbarShell actions={ACTIONS} placement="right" ariaLabel="Canvas tools right" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="size & trailing" description="size='sm'(36px) / 'md'(40px), trailing slot 으로 끝에 추가 노드.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="size=sm" subtitle="36px 버튼">
            <ToolbarShell actions={ACTIONS} size="sm" ariaLabel="Canvas tools sm" />
          </StorybookCard>
          <StorybookCard title="trailing" subtitle="actions 뒤 trailing slot">
            <ToolbarShell
              actions={ACTIONS}
              ariaLabel="Canvas tools trailing"
              trailing={<span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-primary)' }}>100%</span>}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
