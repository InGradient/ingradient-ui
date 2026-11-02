import styled from 'styled-components'
import { Card, SendIcon } from '@ingradient/ui/components'
import { Button, EmptyState, TextareaField, iconSizeNumbers } from '@ingradient/ui'
import { Section } from './RightPanelView.styles'
import type { RightPanelCommentSectionProps } from './types'
import { Inline, Text } from '@ingradient/ui/primitives'

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
  max-height: var(--ig-popup-list-min);
  overflow-y: auto;
`

const CommentMeta = styled.div`
  font-size: var(--ig-text-micro);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-spacing-2);
`


export function RightPanelCommentSection(props: RightPanelCommentSectionProps): JSX.Element {
  const { comments, pendingComment, isSending, labels, onPendingCommentChange, onSend } = props
  return (
    <Section>
      <Text as="div" size="var(--ig-text-micro)" weight="bold" tone="muted" uppercase letterSpacing="wide">{labels.title}</Text>
      {comments.length === 0
        ? <EmptyState>{labels.empty}</EmptyState>
        : (
          <CommentList role="region" aria-label={labels.title} tabIndex={0}>
            {comments.map((c) => (
              <Card
                key={c.id}
                elevation="raised"
                flat
               
                padding="var(--ig-spacing-8)"
                style={{ fontSize: 'var(--ig-text-body-sm)', opacity: c.synced === false ? 'var(--ig-opacity-muted)' : 1 }}
              >
                <CommentMeta>{c.author} · {c.timestamp}</CommentMeta>
                {c.text}
              </Card>
            ))}
          </CommentList>
        )}
      <Inline gap="var(--ig-spacing-8)" align="flex-end" wrap="nowrap">
        <TextareaField
          aria-label={labels.title}
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
      </Inline>
    </Section>
  )
}
