import { useState, type ReactNode } from 'react'
import { Archive, Pencil } from 'lucide-react'
import { Box, Inline, Stack, Text } from '../../primitives'
import { Badge } from '../../components/feedback/badge'
import { Button } from '../../components/inputs/button'
import { IconButton } from '../../components/inputs/icon-button'
import { Textarea } from '../../components/inputs/textarea'
import { CommentItem } from '../../components/data-display/comment-thread'
import { CollapsibleSectionHeader } from '../../components/data-display/collapsible-section-header'
import { CommentThread } from '../comment/comment-thread'
import { MentionTextarea, type MentionCandidate } from '../../components/inputs/mention-textarea'

const BODY_STYLE = { marginTop: 'var(--ig-space-3)' }
const LIST_WRAP_STYLE = { maxHeight: 200, overflowY: 'auto' as const }
const EMPTY_STYLE = { padding: 'var(--ig-space-2)' }

const ERROR_BOX_STYLE = {
  padding: 'var(--ig-space-2) var(--ig-space-3)',
  border: '1px solid var(--ig-color-danger-dim-bg)',
  borderRadius: 'var(--ig-radius-md)',
  background: 'var(--ig-color-danger-dim-bg)',
  color: 'var(--ig-color-danger)',
}

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
      <Inline as="span" gap={1}>
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
      </Inline>
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
    <Stack gap={0} className={className}>
      <CollapsibleSectionHeader
        title={title}
        open={open}
        onClick={() => setOpen((v) => !v)}
        badge={<Badge $tone={count > 0 ? 'accent' : 'neutral'}>{count}</Badge>}
      />
      {open ? (
        <Stack gap={3} style={BODY_STYLE}>
          {count === 0 ? (
            <Text tone="muted" size="var(--ig-font-size-xs)" style={EMPTY_STYLE}>{emptyTextValue}</Text>
          ) : (
            <Box style={LIST_WRAP_STYLE}>
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
            </Box>
          )}
          {composerEnabled ? (
            <Stack gap={2}>
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
                <Inline gap={2} justify="space-between" style={ERROR_BOX_STYLE}>
                  <Text as="span" size="var(--ig-font-size-xs)">{error}</Text>
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
                </Inline>
              ) : null}
              <Inline gap={2} justify="space-between">
                <Text as="span" size="var(--ig-font-size-xs)" tone="muted">Press Ctrl/Cmd+Enter to submit.</Text>
                <Inline as="span" gap={2}>
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
                </Inline>
              </Inline>
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  )
}
