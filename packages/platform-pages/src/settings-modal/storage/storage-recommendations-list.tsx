import styled from 'styled-components'
import { Stack } from '@ingradient/ui/primitives'
import { Skeleton } from '@ingradient/ui/components'

const LIST_STYLE = { listStyle: 'none' as const, padding: 0, margin: 0 }

const Item = styled.li<{ $tone: 'info' | 'warn' }>`
  font-size: var(--ig-font-size-sm);
  color: ${(p) => (p.$tone === 'warn' ? 'var(--ig-color-alert-warning-text)' : 'var(--ig-color-alert-info-text)')};
  padding: var(--ig-space-3) var(--ig-space-5);
  background: ${(p) => (p.$tone === 'warn' ? 'var(--ig-color-alert-warning-bg)' : 'var(--ig-color-alert-info-bg)')};
  border-radius: var(--ig-radius-2xs);
  &::before {
    content: '${(p) => (p.$tone === 'warn' ? '⚠ ' : 'ⓘ ')}';
  }
`

export interface StorageRecommendation {
  tone: 'info' | 'warn'
  text: string
}

export interface StorageRecommendationsListProps {
  recommendations: StorageRecommendation[]
  loading?: boolean
  loadingHeight?: string
}

export function StorageRecommendationsList({
  recommendations, loading, loadingHeight = 'var(--ig-layout-topbar)',
}: StorageRecommendationsListProps) {
  if (loading) return <Skeleton $height={loadingHeight} />
  if (recommendations.length === 0) return null
  return (
    <Stack as="ul" gap="var(--ig-space-2)" style={LIST_STYLE}>
      {recommendations.map((r, i) => (
        <Item key={i} $tone={r.tone}>{r.text}</Item>
      ))}
    </Stack>
  )
}
