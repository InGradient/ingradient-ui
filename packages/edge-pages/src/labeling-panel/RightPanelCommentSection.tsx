import styled from 'styled-components'
import { SendIcon } from '@ingradient/ui/components'
import { Button, EmptyState, TextareaField, iconSizeNumbers } from '@ingradient/ui'
import { Section, Label } from './RightPanelView.styles'
import type { RightPanelCommentSectionProps } from './types'

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  max-height: var(--ig-popup-list-min);
  overflow-y: auto;
`

const CommentItem = styled.div<{ $synced?: boolean }>`
  padding: var(--ig-space-3);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-sm);
  opacity: ${({ $synced }) => ($synced === false ? 0.6 : 1)};
`

const CommentMeta = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-space-2px);
`

const InputRow = styled.div`display: flex; gap: var(--ig-space-2); align-items: flex-end;`

export function RightPanelCommentSection(props: RightPanelCommentSectionProps): JSX.Element {
  const { comments, pendingComment, isSending, labels, onPendingCommentChange, onSend } = props
  return (
    <Section>
      <Label>{labels.title}</Label>
      {comments.length === 0
        ? <EmptyState>{labels.empty}</EmptyState>
        : (
          <CommentList>
            {comments.map((c) => (
              <CommentItem key={c.id} $synced={c.synced}>
                <CommentMeta>{c.author} · {c.timestamp}</CommentMeta>
                {c.text}
              </CommentItem>
            ))}
          </CommentList>
        )}
      <InputRow>
        <TextareaField
          value={pendingComment}
          onChange={(e) => onPendingCommentChange(e.target.value)}
          placeholder={labels.placeholder}
          rows={2}
          style={{ flex: 1 }}
        />
        <Button size="sm" variant="accent" onClick={onSend} disabled={isSending || !pendingComment.trim()}>
          <SendIcon size={iconSizeNumbers.xs} />
          {isSending ? labels.sending : labels.send}
        </Button>
      </InputRow>
    </Section>
  )
}
