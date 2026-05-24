import React from 'react'
import styled from 'styled-components'

const Thread = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export interface CommentThreadProps {
  children: React.ReactNode
  className?: string
}

export function CommentThread({ children, className }: CommentThreadProps) {
  return <Thread className={className}>{children}</Thread>
}
