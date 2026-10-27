import styled from 'styled-components'
import type { ReactNode } from 'react'
import { Grid, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Alert, Button } from '@ingradient/ui/components'

const ContainerBox = styled(Stack)`
`
const ErrorTextBox = styled(Text)`
  color: var(--ig-color-alert-danger-text);
`
const SubTitleBox = styled(Text)`
  margin-bottom: var(--ig-spacing-8);
`

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
  tierTitle = 'Storage by tier',
  projectTitle = 'Storage by project (top 10)',
  resolutionTitle = 'Image size distribution',
  formatTitle = 'Upload format',
  tierEfficiencyTitle = 'Tier efficiency',
  costTitle = 'Monthly cost estimate',
  recommendationsTitle = 'Optimization recommendations',
}: StorageAnalyticsTabProps) {
  if (error) {
    return (
      <ContainerBox gap="var(--ig-spacing-8)">
        <Alert $tone="danger">
          <Stack gap="var(--ig-spacing-8)">
            <ErrorTextBox forwardedAs="p" size="var(--ig-text-body-sm)">{error}</ErrorTextBox>
            {onRetry ? <Button type="button" variant="secondary" size="sm" onClick={onRetry}>Retry</Button> : null}
          </Stack>
        </Alert>
      </ContainerBox>
    )
  }

  return (
    <ContainerBox gap="var(--ig-spacing-8)">
      <Inline justify="space-between">
        {title ? <Text as="h3" size="var(--ig-text-title-sm)" weight="semibold">{title}</Text> : null}
        <Button type="button" variant="secondary" size="sm" disabled={!!copyDisabled} onClick={onCopyReport}>
          Copy Report
        </Button>
      </Inline>

      {overview}

      <Text as="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{tierTitle}</Text>
      {tierChart}

      <Text as="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{projectTitle}</Text>
      {projectChart}

      <Grid gap="var(--ig-spacing-20)" minItemWidth="var(--ig-layout-size-cell-min-wide)">
        <div>
          <SubTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{resolutionTitle}</SubTitleBox>
          {resolutionChart}
        </div>
        <div>
          <SubTitleBox forwardedAs="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{formatTitle}</SubTitleBox>
          {formatChart}
        </div>
      </Grid>

      <Text as="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{tierEfficiencyTitle}</Text>
      {tierTable}

      <Text as="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{costTitle}</Text>
      {costTable}

      {recommendations ? (
        <>
          <Text as="h4" tone="muted" size="var(--ig-text-body-sm)" weight="semibold">{recommendationsTitle}</Text>
          {recommendations}
        </>
      ) : null}
    </ContainerBox>
  )
}
