import React from 'react'
import styled from 'styled-components'

const Root = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const Bubble = styled.span<{ $tone: 'accent' | 'danger' }>`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(42%, -42%);
  min-width: 18px;
  height: 18px;
  padding: 0 var(--ig-space-2);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => (p.$tone === 'accent' ? 'var(--ig-color-accent)' : 'var(--ig-color-danger)')};
  color: var(--ig-color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 0 0 2px var(--ig-color-bg-canvas);
  pointer-events: none;
`

export function NotificationBadge({
  children,
  value,
  hidden = false,
  tone = 'danger',
  className,
  style,
}: {
  children: React.ReactNode
  value?: React.ReactNode
  hidden?: boolean
  tone?: 'accent' | 'danger'
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Root className={className} style={style}>
      {children}
      {!hidden && value != null ? (
        <Bubble data-ig-notification-badge="" $tone={tone}>
          {value}
        </Bubble>
      ) : null}
    </Root>
  )
}
