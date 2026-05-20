import { useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { Archive, Pencil } from 'lucide-react'
import { Badge } from '../../components/feedback/badge'
import { Button } from '../../components/inputs/button'
import { IconButton } from '../../components/inputs/icon-button'
import { CommentItem, CommentThread } from '../../components/data-display/comment-thread'
import { MentionTextarea, type MentionCandidate } from '../../components/inputs/mention-textarea'

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

const ButtonsGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) var(--ig-space-3);
  border: 1px solid var(--ig-color-danger-dim-bg);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-danger-dim-bg);
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
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

export interface CommentsPanelMentionCandidate {
  email: string
  name?: string | null
}

export interface CommentsPanelProps {
  comments: Comment[]

  /** Simple (uncontrolled) composer — submit text directly. */
  onReply?: (text: string) => void

  /** Controlled composer (when set, `draft` + `onChangeDraft` + `onSubmit` are used instead of internal state). */
  draft?: string
  onChangeDraft?: (value: string) => void
  onSubmit?: () => void

  /** Edit mode (controlled). When set, shows "Cancel" button + "Update" label. */
  editingCommentId?: string | null
  onCancelEdit?: () => void

  /** Submitting state — disables submit + shows "Posting..." label. */
  submitting?: boolean
  /** Error message — when set, shows error box (optional Retry button). */
  error?: string | null
  canRetry?: boolean
  onRetry?: () => void

  /** Comment row actions — shown only when `c.canEdit` is true. */
  onEdit?: (commentId: string) => void
  onArchive?: (commentId: string) => void

  /** Mention support — when provided, composer uses `MentionTextarea` with `@`-trigger. */
  mentionCandidates?: CommentsPanelMentionCandidate[]

  /** Custom rendering hooks. */
  renderAuthor?: (comment: Comment) => ReactNode
  renderBody?: (body: string) => ReactNode
  formatTimestamp?: (raw: string) => string

  /** Group context — selects empty text variant. */
  hasGroup?: boolean

  placeholder?: string
  emptyText?: string
  emptyTextGroup?: string
  defaultOpen?: boolean
  title?: string
  className?: string
}

/**
 * Image detail sidebar 의 comments section.
 * - Collapsible 헤더 + Badge count
 * - `CommentThread` + `CommentItem` (muted background, no border)
 * - 200px max-height scrollable list
 * - Composer: 단순 textarea (mentionCandidates 없을 때) 또는 MentionTextarea
 * - Edit mode 지원 (editingCommentId 일 때 Update/Cancel 버튼)
 * - Error display + 옵션 Retry
 */
export function CommentsPanel(props: CommentsPanelProps) {
  const {
    comments,
    onReply,
    draft: controlledDraft,
    onChangeDraft,
    onSubmit: controlledSubmit,
    editingCommentId,
    onCancelEdit,
    submitting,
    error,
    canRetry,
    onRetry,
    onEdit,
    onArchive,
    mentionCandidates,
    renderAuthor,
    renderBody,
    formatTimestamp,
    hasGroup,
    placeholder = 'Add a comment.',
    emptyText = 'No comments yet for this image.',
    emptyTextGroup = 'No comments yet for this group.',
    defaultOpen = true,
    title = 'Comments',
    className,
  } = props
  const isControlled = controlledDraft != null && onChangeDraft != null
  const [internalDraft, setInternalDraft] = useState('')
  const draft = isControlled ? controlledDraft : internalDraft
  const setDraft = isControlled ? onChangeDraft : setInternalDraft
  const [open, setOpen] = useState(defaultOpen)
  const count = comments.length

  const submit = () => {
    if (controlledSubmit) {
      controlledSubmit()
      return
    }
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

  const emptyTextValue = hasGroup ? emptyTextGroup : emptyText
  const submitDisabled = !!submitting || !draft.trim()
  const composerEnabled = !!(onReply || controlledSubmit)
  const mentionInputCandidates: MentionCandidate[] | undefined = mentionCandidates?.map((c) => ({
    id: c.email,
    name: c.name || c.email,
    secondary: c.email,
  }))

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
            <Empty>{emptyTextValue}</Empty>
          ) : (
            <ListWrap>
              <CommentThread>
                {comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    author={renderAuthor ? renderAuthor(c) : c.authorName}
                    timestamp={formatTimestamp ? formatTimestamp(c.createdAt) : c.createdAt}
                    body={renderBody ? <>{renderBody(c.body)}</> : c.body}
                    actions={renderActions(c)}
                  />
                ))}
              </CommentThread>
            </ListWrap>
          )}
          {composerEnabled ? (
            <ComposerWrap>
              {mentionInputCandidates ? (
                <MentionTextarea
                  value={draft}
                  onChange={setDraft}
                  candidates={mentionInputCandidates}
                  onSubmit={submit}
                  placeholder={placeholder}
                />
              ) : (
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
              )}
              {error ? (
                <ErrorBox>
                  <span>{error}</span>
                  {canRetry && onRetry ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      tone="danger"
                      onClick={onRetry}
                      disabled={submitting}
                    >
                      Retry
                    </Button>
                  ) : null}
                </ErrorBox>
              ) : null}
              <ComposerActions>
                <Hint>Press Ctrl/Cmd+Enter to submit.</Hint>
                <ButtonsGroup>
                  {editingCommentId && onCancelEdit ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={onCancelEdit}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="accent"
                    size="sm"
                    disabled={submitDisabled}
                    onClick={submit}
                  >
                    {submitting ? 'Posting…' : editingCommentId ? 'Update' : 'Post'}
                  </Button>
                </ButtonsGroup>
              </ComposerActions>
            </ComposerWrap>
          ) : null}
        </Body>
      ) : null}
    </Root>
  )
}
