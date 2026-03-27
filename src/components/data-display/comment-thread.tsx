import React from 'react'
import styled from 'styled-components'

// ── Styled ─────────────────────────────────────────────────────────

const Thread = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const Item = styled.div`
  padding: var(--ig-space-3) var(--ig-space-4);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-muted);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-2);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
`

const Author = styled.span`
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const Body = styled.div`
  font-size: var(--ig-font-size-sm);
  line-height: 1.5;
  white-space: pre-wrap;
  color: var(--ig-color-text-primary);
`

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 56px;
  resize: vertical;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  &::placeholder { color: var(--ig-color-text-soft); }
  &:focus { outline: none; border-color: var(--ig-color-accent-ring); box-shadow: var(--ig-shadow-focus-ring); }
`

const SendRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

const SendBtn = styled.button`
  padding: var(--ig-space-2) var(--ig-space-5);
  border: none;
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-accent-soft);
  color: #fff;
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { opacity: 0.85; }
`

// ── Components ─────────────────────────────────────────────────────

export interface CommentItemProps {
  author: string
  timestamp?: string
  body: React.ReactNode
  actions?: React.ReactNode
}

export function CommentItem({ author, timestamp, body, actions }: CommentItemProps) {
  return (
    <Item>
      <Meta>
        <Author>{author}</Author>
        {timestamp && <span>{timestamp}</span>}
        {actions}
      </Meta>
      <Body>{body}</Body>
    </Item>
  )
}

export interface CommentThreadProps {
  children: React.ReactNode
  className?: string
}

export function CommentThread({ children, className }: CommentThreadProps) {
  return <Thread className={className}>{children}</Thread>
}

export interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  submitLabel?: string
  disabled?: boolean
  maxLength?: number
}

export function CommentInput({
  value, onChange, onSubmit, placeholder = 'Add a comment...',
  submitLabel = 'Send', disabled, maxLength,
}: CommentInputProps) {
  return (
    <InputWrap>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && onSubmit) {
            e.preventDefault()
            onSubmit()
          }
        }}
      />
      {onSubmit && (
        <SendRow>
          <SendBtn type="button" disabled={disabled || !value.trim()} onClick={onSubmit}>
            {submitLabel}
          </SendBtn>
        </SendRow>
      )}
    </InputWrap>
  )
}
