import { useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { Archive, Pencil } from 'lucide-react'
import { Badge } from '../../components/feedback/badge'
import { Button } from '../../components/inputs/button'
import { IconButton } from '../../components/inputs/icon-button'
import { CommentItem, CommentThread } from '../../components/data-display/comment-thread'

const Root = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) 0;
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
`

const Title = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-3);
`

const ListWrap = styled.div`
  max-height: 200px;
  overflow-y: auto;
`

const Empty = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-2);
`

const ComposerWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: var(--ig-space-3);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-family: inherit;
  resize: vertical;
  &::placeholder {
    color: var(--ig-color-text-soft);
  }
  &:focus-visible {
    outline: none;
    border-color: var(--ig-color-accent);
  }
`

const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-2);
`

const Hint = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

const ActionsGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
`

export interface Comment {
  id: string
  authorName: string
  authorEmail?: string
  authorAvatarUrl?: string
  authorInitials?: string
  body: string
  createdAt: string
  canEdit?: boolean
}

export interface CommentsPanelProps {
  comments: Comment[]
  onReply?: (text: string) => void
  onEdit?: (commentId: string) => void
  onArchive?: (commentId: string) => void
  placeholder?: string
  submitting?: boolean
  emptyText?: string
  defaultOpen?: boolean
  title?: string
  className?: string
}

/**
 * Image detail sidebar 의 comments section.
 * platform 의 `ImageDetailComments` 와 동일 시각:
 * - Collapsible 헤더 + Badge count
 * - `CommentThread` + `CommentItem` (muted background, no border)
 * - 200px max-height scrollable list
 * - 하단 composer (textarea + Ctrl/Cmd+Enter 힌트 + Post 버튼)
 */
export function CommentsPanel({
  comments,
  onReply,
  onEdit,
  onArchive,
  placeholder = 'Add a comment.',
  submitting,
  emptyText = 'No comments yet for this image.',
  defaultOpen = true,
  title = 'Comments',
  className,
}: CommentsPanelProps) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(defaultOpen)
  const count = comments.length

  const submit = () => {
    const text = draft.trim()
    if (!text || !onReply) return
    onReply(text)
    setDraft('')
  }

  const renderActions = (c: Comment): ReactNode => {
    if (!c.canEdit || (!onEdit && !onArchive)) return undefined
    return (
      <ActionsGroup>
        {onEdit ? (
          <IconButton
            variant="secondary"
            size="sm"
            aria-label="Edit comment"
            title="Edit comment"
            onClick={() => onEdit(c.id)}
          >
            <Pencil size={14} />
          </IconButton>
        ) : null}
        {onArchive ? (
          <IconButton
            variant="secondary"
            size="sm"
            tone="danger"
            aria-label="Archive comment"
            title="Archive comment"
            onClick={() => onArchive(c.id)}
          >
            <Archive size={14} />
          </IconButton>
        ) : null}
      </ActionsGroup>
    )
  }

  return (
    <Root className={className}>
      <Header type="button" onClick={() => setOpen((v) => !v)}>
        <Title>
          <span>{open ? '▾' : '▸'}</span>
          {title}
        </Title>
        <Badge $tone={count > 0 ? 'accent' : 'neutral'}>{count}</Badge>
      </Header>
      {open ? (
        <Body>
          {count === 0 ? (
            <Empty>{emptyText}</Empty>
          ) : (
            <ListWrap>
              <CommentThread>
                {comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    author={c.authorName}
                    timestamp={c.createdAt}
                    body={c.body}
                    actions={renderActions(c)}
                  />
                ))}
              </CommentThread>
            </ListWrap>
          )}
          {onReply ? (
            <ComposerWrap>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    submit()
                  }
                }}
              />
              <ComposerActions>
                <Hint>Press Ctrl/Cmd+Enter to submit.</Hint>
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  disabled={!draft.trim() || submitting}
                  onClick={submit}
                >
                  {submitting ? 'Posting…' : 'Post'}
                </Button>
              </ComposerActions>
            </ComposerWrap>
          ) : null}
        </Body>
      ) : null}
    </Root>
  )
}
