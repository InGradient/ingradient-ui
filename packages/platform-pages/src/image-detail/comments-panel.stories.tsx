import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommentsPanel, type Comment } from './comments-panel'

const meta: Meta<typeof CommentsPanel> = {
  title: 'Platform Pages/Image Detail/CommentsPanel',
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

const MENTION_CANDIDATES = [
  { email: 'june@example.com', name: 'June Lee' },
  { email: 'soyeon@example.com', name: 'Soyeon Park' },
  { email: 'minho@example.com', name: 'Minho Kim' },
]

function MentionDemo() {
  const [comments, setComments] = useState<Comment[]>(INITIAL)
  const [draft, setDraft] = useState('')
  return (
    <CommentsPanel
      comments={comments}
      draft={draft}
      onChangeDraft={setDraft}
      onSubmit={() => {
        if (!draft.trim()) return
        setComments((prev) => [...prev, { id: String(prev.length + 1), authorName: 'You', body: draft, createdAt: 'just now' }])
        setDraft('')
      }}
      mentionCandidates={MENTION_CANDIDATES}
    />
  )
}
export const WithMentions: Story = { render: () => <MentionDemo /> }

function EditModeDemo() {
  const [comments] = useState<Comment[]>(INITIAL.map((c) => ({ ...c, canEdit: true })))
  const [editingId, setEditingId] = useState<string | null>('c1')
  const [draft, setDraft] = useState('Editing this comment…')
  return (
    <CommentsPanel
      comments={comments}
      draft={draft}
      onChangeDraft={setDraft}
      onSubmit={() => undefined}
      editingCommentId={editingId}
      onCancelEdit={() => { setEditingId(null); setDraft('') }}
      onEdit={(id) => { setEditingId(id); setDraft(comments.find((c) => c.id === id)?.body ?? '') }}
      onArchive={() => undefined}
    />
  )
}
export const EditMode: Story = { render: () => <EditModeDemo /> }

export const WithError: Story = {
  args: {
    comments: INITIAL,
    draft: 'My reply',
    onChangeDraft: () => undefined,
    onSubmit: () => undefined,
    error: 'Failed to post comment.',
    canRetry: true,
    onRetry: () => undefined,
  },
}

export const Submitting: Story = {
  args: {
    comments: INITIAL,
    draft: 'My reply',
    onChangeDraft: () => undefined,
    onSubmit: () => undefined,
    submitting: true,
  },
}
