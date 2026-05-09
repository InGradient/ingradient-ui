import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './pagination'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { page: 1, totalPages: 5, onChange: () => undefined },
  render: () => {
    const [smallPage, setSmallPage] = React.useState(2)
    const [mediumPage, setMediumPage] = React.useState(5)

    return (
      <StorybookPage
        title="Pagination"
        description="Page selector with one button per page. Active page uses solid button, others use secondary. Caller manages current page state."
      >
        <StorybookSection title="Variants" description="Different total page counts.">
          <StorybookGrid columns="1fr">
            <StorybookCard title="3 pages" subtitle="small total — shows all pages">
              <Pagination page={1} totalPages={3} onChange={() => undefined} />
            </StorybookCard>
            <StorybookCard title="5 pages (interactive)" subtitle={`current page: ${smallPage}`}>
              <Pagination page={smallPage} totalPages={5} onChange={setSmallPage} />
            </StorybookCard>
            <StorybookCard title="10 pages" subtitle={`current: ${mediumPage} — buttons wrap on narrow viewport`}>
              <Pagination page={mediumPage} totalPages={10} onChange={setMediumPage} />
            </StorybookCard>
            <StorybookCard title="single page" subtitle="totalPages=1 — only one button">
              <Pagination page={1} totalPages={1} onChange={() => undefined} />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
