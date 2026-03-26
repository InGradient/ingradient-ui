import React from 'react'
import styled from 'styled-components'
import { useClipboard } from '../../hooks'

const Btn = styled.button<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: ${(p) => (p.$size === 'sm' ? 'var(--ig-space-1) var(--ig-space-3)' : 'var(--ig-space-2) var(--ig-space-4)')};
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-muted);
  font-size: ${(p) => (p.$size === 'sm' ? 'var(--ig-font-size-2xs)' : 'var(--ig-font-size-xs)')};
  cursor: pointer;
  transition: color var(--ig-motion-fast), border-color var(--ig-motion-fast);
  &:hover { color: var(--ig-color-text-primary); border-color: var(--ig-color-border-strong); }
`

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

export interface CopyButtonProps {
  value: string
  children?: React.ReactNode
  copiedLabel?: string
  size?: 'sm' | 'md'
  className?: string
}

export function CopyButton({
  value, children, copiedLabel = 'Copied!', size = 'md', className,
}: CopyButtonProps) {
  const { copy, copied } = useClipboard()

  return (
    <Btn type="button" $size={size} className={className} onClick={() => void copy(value)}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? copiedLabel : children ?? 'Copy'}
    </Btn>
  )
}
