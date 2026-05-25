import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
import { Button } from '../../components/inputs/button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-9);
  padding: var(--ig-space-1) 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`


const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--ig-space-9);
`

const ErrorWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  padding: var(--ig-space-7);
  background: var(--ig-color-alert-danger-bg);
  border: 1px solid var(--ig-color-alert-danger-border);
  border-radius: var(--ig-radius-xxs);
`

const ErrorMessage = styled.p`
  margin: 0;
  color: var(--ig-color-alert-danger-text);
  font-size: 13px;
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
      <Container>
        <ErrorWrap>
          <ErrorMessage>{error}</ErrorMessage>
          {onRetry ? <Button type="button" variant="secondary" size="sm" onClick={onRetry}>Retry</Button> : null}
        </ErrorWrap>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Text as="h3" size="16px" weight={600}>{title}</Text>
        <Button type="button" variant="secondary" size="sm" disabled={!!copyDisabled} onClick={onCopyReport}>
          Copy Report
        </Button>
      </Header>

      {overview}

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{tierTitle}</Text>
      {tierChart}

      <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px">{projectTitle}</Text>
      {projectChart}

      <Grid>
        <div>
          <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px" style={{ marginBottom: 8 }}>{resolutionTitle}</Text>
          {resolutionChart}
        </div>
        <div>
          <Text as="h4" tone="muted" size="13px" weight={600} uppercase letterSpacing="0.5px" style={{ marginBottom: 8 }}>{formatTitle}</Text>
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
    </Container>
  )
}
