import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagList, type TagItemData } from './tag-list'
import { buildTagItems, resolveReviewScale, type ContentLength } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

type TagListStoryArgs = {
  contentLength: ContentLength
  dataset: 'auto' | 'sparse' | 'realistic' | 'overloaded'
}

const meta = {
  title: 'Components/Data Display/TagList',
  component: TagList as unknown as React.ComponentType<TagListStoryArgs>,
  tags: ['autodocs'],
  args: {
    contentLength: 'short',
    dataset: 'auto',
  },
  argTypes: {
    contentLength: {
      control: 'inline-radio',
      options: ['short', 'long'],
    },
    dataset: {
      control: 'inline-radio',
      options: ['auto', 'sparse', 'realistic', 'overloaded'],
    },
  },
} satisfies Meta<TagListStoryArgs>

export default meta

type Story = StoryObj<TagListStoryArgs>

export const Playground: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const items: TagItemData[] = buildTagItems(scale, args.contentLength)
    const [selectedId, setSelectedId] = React.useState<string | null>('person')

    return (
      <div style={{ maxWidth: 320 }}>
        <TagList items={items} selectedId={selectedId} onItemClick={setSelectedId} />
      </div>
    )
  },
}

export const Review: Story = {
  render: (args, context) => {
    const scale = args.dataset === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.dataset
    const items: TagItemData[] = buildTagItems(scale, args.contentLength)
    const [selectedId, setSelectedId] = React.useState<string | null>('pedestrian-crossing')

    return (
      <StorybookPage
        title="TagList"
        description="Tag navigation should be reviewed with realistic vocabulary length and category count, because truncation and emphasis are usually the actual design risk."
        meta={
          <StorybookMetaBar
            items={[
              { label: 'stable', tone: 'success' },
              { label: `${scale} data`, tone: scale === 'overloaded' ? 'warning' : 'neutral' },
              { label: 'mobile-reviewed', tone: 'warning' },
            ]}
          />
        }
      >
        <StorybookSection
          title="Tag navigation review"
          description="Review single selection and active-set emphasis under the same dataset and label length preset."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
            <StorybookCard title="Single selection" subtitle="active item 하나를 강조">
              <TagList items={items} selectedId={selectedId} onItemClick={setSelectedId} />
            </StorybookCard>
            <StorybookCard title="Active set" subtitle="여러 항목이 활성화된 상태">
              <TagList items={items} activeIds={new Set(['car', 'person'])} />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
