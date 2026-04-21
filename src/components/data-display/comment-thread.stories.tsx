import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommentInput, CommentItem, CommentThread } from './comment-thread'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/CommentThread',
  component: CommentThread,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof CommentThread>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [draft, setDraft] = React.useState('Looks good overall, but the border needs more contrast.')
    const [comments, setComments] = React.useState([
      {
        id: '1',
        author: 'J. Kim',
        timestamp: '2m ago',
        body: 'Toolbar spacing feels stable now. We should keep this shell for the rest of the review pages.',
      },
      {
        id: '2',
        author: 'M. Park',
        timestamp: 'Just now',
        body: 'Need one more pass on mobile because the inspector stack gets tall.',
      },
    ])

    return (
      <StorybookPage
        title="Comment Thread"
        description="Comment UI stays intentionally simple. Thread rendering and input are reusable, while persistence and mention workflow remain outside the core component."
      >
        <StorybookSection
          title="Thread and composer"
          description="Review the common states together instead of separating thread and input into unrelated examples."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="Active thread" subtitle="comments + composer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <CommentThread>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      author={comment.author}
                      timestamp={comment.timestamp}
                      body={comment.body}
                    />
                  ))}
                </CommentThread>
                <CommentInput
                  value={draft}
                  onChange={setDraft}
                  onSubmit={() => {
                    if (!draft.trim()) return
                    setComments((prev) => [
                      ...prev,
                      {
                        id: String(prev.length + 1),
                        author: 'You',
                        timestamp: 'Now',
                        body: draft.trim(),
                      },
                    ])
                    setDraft('')
                  }}
                />
              </div>
            </StorybookCard>
            <StorybookCard title="Empty thread" subtitle="no comments yet">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <CommentThread>{null}</CommentThread>
                <CommentInput
                  value=""
                  onChange={() => undefined}
                  placeholder="Be the first reviewer to leave a note."
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
