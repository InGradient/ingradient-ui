import type { ReactNode } from 'react'
import { Grid, Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'

const CONTAINER_STYLE = { padding: 'var(--ig-space-1) 0' }
const ERROR_WRAP_STYLE = {
  padding: 'var(--ig-space-7)',
  background: 'var(--ig-color-alert-danger-bg)',
  border: '1px solid var(--ig-color-alert-danger-border)',
  borderRadius: 'var(--ig-radius-xxs)',
}
const ERROR_TEXT_STYLE = { color: 'var(--ig-color-alert-danger-text)' }
const SUB_TITLE_STYLE = { marginBottom: 8 }

export interface StorageAnalyticsTabProps {
  title?: string
  copyDisabled?: boolean
  onCopyReport?: () => void
  /** error 가 있으면 error UI 만 표시 (retry 포함) */
  error?: string | null
  onRetry?: () => void

  overview: ReactNode
  tierChart: ReactNode
  projectChart: ReactNode
  resolutionChart: ReactNode
  formatChart: ReactNode
  tierTable: ReactNode
  costTable: ReactNode
  recommendations?: ReactNode

  tierTitle?: string
  projectTitle?: string
  resolutionTitle?: string
  formatTitle?: string
  tierEfficiencyTitle?: string
  costTitle?: string
  recommendationsTitle?: string
}

export function StorageAnalyticsTab({
  title = 'Storage Analytics',
  copyDisabled, onCopyReport,
  error, onRetry,
  overview, tierChart, projectChart, resolutionChart, formatChart, tierTable, costTable, recommendations,
  tierTitle = 'Storage by Tier',
  projectTitle = 'Storage by Project (Top 10)',
  resolutionTitle = 'Image Size Distribution',
  formatTitle = 'Upload Format',
  tierEfficiencyTitle = 'Tier Efficiency',
  costTitle = 'Monthly Cost Estimate',
  recommendationsTitle = 'Optimization Recommendations',
}: StorageAnalyticsTabProps) {
  if (error) {
    return (
      <Stack gap={9} style={CONTAINER_STYLE}>
        <Stack gap={3} style={ERROR_WRAP_STYLE}>
          <Text as="p" size="13px" style={ERROR_TEXT_STYLE}>{error}</Text>
          {onRetry ? <Button type="button" variant="secondary" size="sm" onClick={onRetry}>Retry</Button> : null}
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack gap={9} style={CONTAINER_STYLE}>
      <Inline justify="space-between">
        <Text as="h3" size="16px" weight={600}>{title}</Text>
        <Button type="button" variant="secondary" size="sm" disabled={!!copyDisabled} onClick={onCopyReport}>
          Copy Report
        </Button>
      </Inline>

      {overview}

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{tierTitle}</Text>
      {tierChart}

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{projectTitle}</Text>
      {projectChart}

      <Grid gap={9} columns="1fr 1fr">
        <div>
          <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px" style={SUB_TITLE_STYLE}>{resolutionTitle}</Text>
          {resolutionChart}
        </div>
        <div>
          <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px" style={SUB_TITLE_STYLE}>{formatTitle}</Text>
          {formatChart}
        </div>
      </Grid>

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{tierEfficiencyTitle}</Text>
      {tierTable}

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{costTitle}</Text>
      {costTable}

      {recommendations ? (
        <>
          <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{recommendationsTitle}</Text>
          {recommendations}
        </>
      ) : null}
    </Stack>
  )
}
