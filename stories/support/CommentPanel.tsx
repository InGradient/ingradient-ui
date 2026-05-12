import React, { useState } from 'react'
import { addComment, deleteComment, getStoredAuthor, listComments, setStoredAuthor, type Comment } from './comments'

/**
 * Page story 좌하단 댓글 패널 (collapsible). 디자이너가 시각/UX 코멘트를 storyId 별로 남김.
 * § 25.3 V2 의 Designer Comment Panel.
 */

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  left: 16,
  bottom: 16,
  zIndex: 9999,
  background: 'var(--ig-color-surface-raised)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 12,
  boxShadow: 'var(--ig-shadow-floating)',
  fontFamily: 'var(--ig-font-sans)',
  fontSize: 'var(--ig-font-size-xs)',
  width: 280,
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--ig-space-2) var(--ig-space-4)',
  cursor: 'pointer',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const labelStyle: React.CSSProperties = {
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  fontWeight: 600,
  letterSpacing: '0.04em',
}

const countBadge: React.CSSProperties = {
  background: 'var(--ig-color-accent-soft-surface, rgba(91, 144, 255, 0.16))',
  color: 'var(--ig-color-accent-soft)',
  borderRadius: 999,
  padding: '0 6px',
  fontSize: 'var(--ig-font-size-2xs)',
  fontWeight: 700,
}

const bodyStyle: React.CSSProperties = {
  padding: 'var(--ig-space-3) var(--ig-space-4)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-3)',
  maxHeight: 360,
  overflowY: 'auto',
}

const commentRowStyle: React.CSSProperties = {
  borderLeft: '2px solid var(--ig-color-accent-soft)',
  paddingLeft: 'var(--ig-space-3)',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const commentMeta: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-2xs)',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--ig-color-surface-muted)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 6,
  padding: 'var(--ig-space-2) var(--ig-space-3)',
  color: 'var(--ig-color-text-primary)',
  fontSize: 'var(--ig-font-size-xs)',
  fontFamily: 'inherit',
  resize: 'vertical',
  minHeight: 60,
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--ig-color-accent)',
  color: 'var(--ig-color-bg-canvas)',
  border: 'none',
  borderRadius: 6,
  padding: 'var(--ig-space-1) var(--ig-space-3)',
  fontSize: 'var(--ig-font-size-xs)',
  fontWeight: 600,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--ig-color-text-muted)',
  border: 'none',
  fontSize: 'var(--ig-font-size-2xs)',
  cursor: 'pointer',
  padding: 0,
}

interface Props {
  storyId: string
}

export function CommentPanel({ storyId }: Props) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(() => listComments(storyId))
  const [author, setAuthor] = useState<string>(() => getStoredAuthor())
  const [body, setBody] = useState('')

  const refresh = () => setComments(listComments(storyId))

  const handleAdd = () => {
    const c = addComment(storyId, author, body)
    if (!c) return
    setStoredAuthor(author.trim())
    setBody('')
    refresh()
  }

  const handleDelete = (id: string) => {
    deleteComment(storyId, id)
    refresh()
  }

  return (
    <div style={containerStyle} aria-label="Designer comments">
      <div style={headerStyle} onClick={() => setOpen(!open)} role="button" tabIndex={0}>
        <span style={labelStyle}>Comments</span>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {comments.length > 0 ? <span style={countBadge}>{comments.length}</span> : null}
          <span style={{ color: 'var(--ig-color-text-muted)' }}>{open ? '▼' : '▲'}</span>
        </span>
      </div>
      {open ? (
        <div style={bodyStyle}>
          {comments.length === 0 ? (
            <span style={{ color: 'var(--ig-color-text-muted)' }}>(no comments yet)</span>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={commentRowStyle}>
                <div style={commentMeta}>
                  <span style={{ fontWeight: 600, color: 'var(--ig-color-text-secondary)' }}>{c.author}</span>
                  <button type="button" style={btnGhost} onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
                <span style={{ color: 'var(--ig-color-text-primary)' }}>{c.body}</span>
                <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-2xs)' }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ ...inputStyle, minHeight: 'auto' }}
          />
          <textarea
            placeholder="Add a comment about this story…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={inputStyle}
          />
          <button type="button" style={btnPrimary} onClick={handleAdd} disabled={!body.trim()}>
            Add comment
          </button>
        </div>
      ) : null}
    </div>
  )
}
