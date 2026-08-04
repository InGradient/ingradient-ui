import React from 'react'
import styled from 'styled-components'

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
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  margin-right: auto;
`

const Body = styled.div`
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-line-height-relaxed);
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
  min-height: var(--ig-control-height-2xl-wide);
  resize: vertical;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
  &::placeholder { color: var(--ig-color-text-soft); }
  &:focus-visible { border-color: var(--ig-color-accent-ring); box-shadow: var(--ig-shadow-focus-ring); }
`

const SendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ig-space-2);
`

const SendBtn = styled.button`
  padding: var(--ig-space-2) var(--ig-space-5);
  border: none;
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-accent-strong);
  color: var(--ig-color-on-accent);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  &:disabled { opacity: var(--ig-opacity-faded); cursor: default; }
  &:hover:not(:disabled) { opacity: var(--ig-opacity-loud); }
`

export interface CommentItemProps {
  author: React.ReactNode
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

export interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  submitLabel?: string
  disabled?: boolean
  maxLength?: number
  /** 전송 버튼 바로 왼쪽 슬롯 — 첨부 버튼 등 보조 액션 배치용 */
  accessory?: React.ReactNode
}

export function CommentInput({
  value, onChange, onSubmit, placeholder = 'Add a comment...',
  submitLabel = 'Send', disabled, maxLength, accessory,
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
          {accessory}
          <SendBtn type="button" disabled={disabled || !value.trim()} onClick={onSubmit}>
            {submitLabel}
          </SendBtn>
        </SendRow>
      )}
    </InputWrap>
  )
}
