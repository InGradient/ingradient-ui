import React from 'react'
import styled from 'styled-components'

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-2);
`

const Tag = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: 4px 10px 4px 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-surface-interactive);
  border: 1px solid var(--ig-color-border-subtle);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-primary);
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    flex-shrink: 0;
  }
`

const Empty = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

export interface ImageClassTag {
  id: string
  name: string
  color: string
  count?: number
}

export interface ImageClassTagsProps {
  tags: ImageClassTag[]
  emptyMessage?: string
  className?: string
}

export function ImageClassTags({ tags, emptyMessage = 'No classes assigned', className }: ImageClassTagsProps) {
  if (tags.length === 0) return <Empty className={className}>{emptyMessage}</Empty>
  return (
    <List className={className}>
      {tags.map((t) => (
        <Tag key={t.id} $color={t.color}>
          {t.name}{typeof t.count === 'number' ? ` · ${t.count}` : ''}
        </Tag>
      ))}
    </List>
  )
}
