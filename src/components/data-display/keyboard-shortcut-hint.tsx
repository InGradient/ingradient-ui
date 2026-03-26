import React from 'react'
import styled from 'styled-components'

const Wrap = styled.span<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`

const Key = styled.kbd<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${(p) => (p.$size === 'sm' ? '16px' : '20px')};
  height: ${(p) => (p.$size === 'sm' ? '16px' : '20px')};
  padding: 0 ${(p) => (p.$size === 'sm' ? '3px' : '4px')};
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-interactive);
  color: var(--ig-color-text-soft);
  font-family: inherit;
  font-size: ${(p) => (p.$size === 'sm' ? '10px' : '11px')};
  font-weight: 500;
  line-height: 1;
`

export interface KeyboardShortcutHintProps {
  keys: string[]
  size?: 'sm' | 'md'
  className?: string
}

export function KeyboardShortcutHint({ keys, size = 'md', className }: KeyboardShortcutHintProps) {
  return (
    <Wrap $size={size} className={className}>
      {keys.map((k, i) => (
        <Key key={i} $size={size}>{k}</Key>
      ))}
    </Wrap>
  )
}
