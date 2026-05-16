import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
  margin: 0;
`

const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const ErrorWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--ig-color-alert-danger-bg);
  border: 1px solid var(--ig-color-alert-danger-border);
  border-radius: 8px;
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
        <Title>{title}</Title>
        <Button type="button" variant="secondary" size="sm" disabled={!!copyDisabled} onClick={onCopyReport}>
          Copy Report
        </Button>
      </Header>

      {overview}

      <SectionTitle>{tierTitle}</SectionTitle>
      {tierChart}

      <SectionTitle>{projectTitle}</SectionTitle>
      {projectChart}

      <Grid>
        <div>
          <SectionTitle style={{ marginBottom: 8 }}>{resolutionTitle}</SectionTitle>
          {resolutionChart}
        </div>
        <div>
          <SectionTitle style={{ marginBottom: 8 }}>{formatTitle}</SectionTitle>
          {formatChart}
        </div>
      </Grid>

      <SectionTitle>{tierEfficiencyTitle}</SectionTitle>
      {tierTable}

      <SectionTitle>{costTitle}</SectionTitle>
      {costTable}

      {recommendations ? (
        <>
          <SectionTitle>{recommendationsTitle}</SectionTitle>
          {recommendations}
        </>
      ) : null}
    </Container>
  )
}
