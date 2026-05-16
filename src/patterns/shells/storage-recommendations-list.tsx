import styled from 'styled-components'
import { Skeleton } from '../../components/feedback/skeleton'

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Item = styled.li<{ $tone: 'info' | 'warn' }>`
  font-size: 13px;
  color: ${(p) => (p.$tone === 'warn' ? 'var(--ig-color-alert-warning-text)' : 'var(--ig-color-alert-info-text)')};
  padding: 8px 12px;
  background: ${(p) => (p.$tone === 'warn' ? 'var(--ig-color-alert-warning-bg)' : 'var(--ig-color-alert-info-bg)')};
  border-radius: 6px;
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
  recommendations, loading, loadingHeight = '80px',
}: StorageRecommendationsListProps) {
  if (loading) return <Skeleton $height={loadingHeight} />
  if (recommendations.length === 0) return null
  return (
    <List>
      {recommendations.map((r, i) => (
        <Item key={i} $tone={r.tone}>{r.text}</Item>
      ))}
    </List>
  )
}
