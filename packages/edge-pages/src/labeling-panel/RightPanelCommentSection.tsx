import styled from 'styled-components'
import { Card, SendIcon } from '@ingradient/ui/components'
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
              <Card
                key={c.id}
                elevation="raised"
                flat
                radius="var(--ig-radius-xs)"
                padding="var(--ig-space-3)"
                style={{ fontSize: 'var(--ig-font-size-sm)', opacity: c.synced === false ? 'var(--ig-opacity-muted)' : 1 }}
              >
                <CommentMeta>{c.author} · {c.timestamp}</CommentMeta>
                {c.text}
              </Card>
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
