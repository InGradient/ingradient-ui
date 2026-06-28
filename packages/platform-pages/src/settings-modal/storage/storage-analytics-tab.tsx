import type { ReactNode } from 'react'
import { Grid, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Alert, Button } from '@ingradient/ui/components'

const CONTAINER_STYLE = {}
const ERROR_TEXT_STYLE = { color: 'var(--ig-color-alert-danger-text)' }
const SUB_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }

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
      <Stack gap="var(--ig-space-4)" style={CONTAINER_STYLE}>
        <Alert $tone="danger">
          <Stack gap="var(--ig-space-3)">
            <Text as="p" size="var(--ig-font-size-sm)" style={ERROR_TEXT_STYLE}>{error}</Text>
            {onRetry ? <Button type="button" variant="secondary" size="sm" onClick={onRetry}>Retry</Button> : null}
          </Stack>
        </Alert>
      </Stack>
    )
  }

  return (
    <Stack gap="var(--ig-space-4)" style={CONTAINER_STYLE}>
      <Inline justify="space-between">
        {title ? <Text as="h3" size="var(--ig-font-size-xl)" weight={600}>{title}</Text> : null}
        <Button type="button" variant="secondary" size="sm" disabled={!!copyDisabled} onClick={onCopyReport}>
          Copy Report
        </Button>
      </Inline>

      {overview}

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px">{tierTitle}</Text>
      {tierChart}

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px">{projectTitle}</Text>
      {projectChart}

      <Grid gap="var(--ig-space-9)" columns="1fr 1fr">
        <div>
          <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px" style={SUB_TITLE_STYLE}>{resolutionTitle}</Text>
          {resolutionChart}
        </div>
        <div>
          <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px" style={SUB_TITLE_STYLE}>{formatTitle}</Text>
          {formatChart}
        </div>
      </Grid>

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px">{tierEfficiencyTitle}</Text>
      {tierTable}

      <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px">{costTitle}</Text>
      {costTable}

      {recommendations ? (
        <>
          <Text as="h4" tone="muted" size="var(--ig-font-size-sm)" weight={600} uppercase letterSpacing="0.5px">{recommendationsTitle}</Text>
          {recommendations}
        </>
      ) : null}
    </Stack>
  )
}
