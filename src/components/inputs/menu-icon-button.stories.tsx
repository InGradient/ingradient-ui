import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuIconButton } from './menu-icon-button'
import { KebabIcon } from '../icons/catalog-icons'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/MenuIconButton',
  component: MenuIconButton,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof MenuIconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { $active: false, 'aria-label': 'Open menu', children: <KebabIcon /> },
  render: () => (
    <StorybookPage
      title="MenuIconButton"
      description="행·카드의 케밥(⋮) 메뉴 트리거. 메뉴가 열린 상태($active)면 accent 하이라이트, 평상시엔 muted 투명. IconButton(secondary/sm)을 확장하므로 focus-visible 등 기본 동작 상속."
    >
      <StorybookSection title="상태" description="$active(메뉴 열림) 여부 + disabled.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-2xs), 1fr))">
          <StorybookCard title="default" subtitle="$active=false (muted)">
            <MenuIconButton $active={false} aria-label="Open menu"><KebabIcon /></MenuIconButton>
          </StorybookCard>
          <StorybookCard title="active" subtitle="$active=true (accent 하이라이트)">
            <MenuIconButton $active aria-label="Close menu"><KebabIcon /></MenuIconButton>
          </StorybookCard>
          <StorybookCard title="disabled" subtitle="disabled">
            <MenuIconButton $active={false} disabled aria-label="Menu disabled"><KebabIcon /></MenuIconButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
