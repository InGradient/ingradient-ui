import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommentsPanel, type Comment } from './comments-panel'

const meta: Meta<typeof CommentsPanel> = {
  title: 'Patterns/CommentsPanel',
  component: CommentsPanel,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const INITIAL: Comment[] = [
  { id: 'c1', authorName: 'June Lee', authorInitials: 'JL', body: 'Suspected crack on top-left edge.', createdAt: '2 hours ago' },
  { id: 'c2', authorName: 'Soyeon Park', authorInitials: 'SP', body: 'Confirmed. Reassigned class to "Crack".', createdAt: '1 hour ago' },
]

function Demo() {
  const [comments, setComments] = useState<Comment[]>(INITIAL)
  return (
    <CommentsPanel
      comments={comments}
      onReply={(text) => setComments((prev) => [...prev, { id: String(prev.length + 1), authorName: 'You', authorInitials: 'Y', body: text, createdAt: 'just now' }])}
    />
  )
}

export const Interactive: Story = { render: () => <Demo /> }
export const Empty: Story = { args: { comments: [], onReply: () => undefined } }
