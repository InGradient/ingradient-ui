import styled from 'styled-components'
import { Send } from 'lucide-react'
import { Button, TextareaField } from '@ingradient/ui'
import { Section, Label } from './RightPanelView.styles'
import type { RightPanelCommentSectionProps } from './types'

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  max-height: 200px;
  overflow-y: auto;
`

const CommentItem = styled.div<{ $synced?: boolean }>`
  padding: var(--ig-space-3);
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-sm);
  opacity: ${({ $synced }) => ($synced === false ? 0.6 : 1)};
`

const CommentMeta = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  margin-bottom: 2px;
`

const Empty = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-4) 0;
`

const InputRow = styled.div`display: flex; gap: var(--ig-space-2); align-items: flex-end;`

export function RightPanelCommentSection(props: RightPanelCommentSectionProps): JSX.Element {
  const { comments, pendingComment, isSending, labels, onPendingCommentChange, onSend } = props
  return (
    <Section>
      <Label>{labels.title}</Label>
      {comments.length === 0
        ? <Empty>{labels.empty}</Empty>
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
          <Send size={12} />
          {isSending ? labels.sending : labels.send}
        </Button>
      </InputRow>
    </Section>
  )
}
