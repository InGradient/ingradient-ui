import styled from 'styled-components'

const Wrap = styled.span<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2px);
`

const Key = styled.kbd<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${(p) => (p.$size === 'sm' ? 'var(--ig-icon-md)' : 'var(--ig-icon-xl)')};
  height: ${(p) => (p.$size === 'sm' ? 'var(--ig-icon-md)' : 'var(--ig-icon-xl)')};
  padding: 0 ${(p) => (p.$size === 'sm' ? 'var(--ig-space-3px)' : 'var(--ig-space-1)')};
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-interactive);
  color: var(--ig-color-text-soft);
  font-family: inherit;
  font-size: ${(p) => (p.$size === 'sm' ? 'var(--ig-font-size-3xs)' : 'var(--ig-font-size-2xs)')};
  font-weight: var(--ig-font-weight-medium);
  line-height: var(--ig-line-height-none);
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
