import { iconSizeNumbers } from '@ingradient/ui'
import { Inline, Stack } from '@ingradient/ui/primitives'
import { Alert, Skeleton, AlertTriangleIcon, InfoIcon } from '@ingradient/ui/components'

const LIST_STYLE = { listStyle: 'none' as const, padding: 0, margin: 0 }

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
        <Alert as="li" key={i} $tone={r.tone === 'warn' ? 'warning' : 'info'}>
          <Inline gap="var(--ig-space-2)" align="flex-start">
            {r.tone === 'warn'
              ? <AlertTriangleIcon size={iconSizeNumbers.sm} />
              : <InfoIcon size={iconSizeNumbers.sm} />}
            <span>{r.text}</span>
          </Inline>
        </Alert>
      ))}
    </Stack>
  )
}
