import { useId } from 'react'
import { iconSizeNumbers, Card } from '@ingradient/ui'
import { EmptyState, ChevronDownIcon, ChevronRightIcon } from '@ingradient/ui/components'
import { Container, Header, Title, SummaryGrid, SummaryLabel, SectionHeader, SectionContent } from './StaticsView.styles'
import { SessionChartsView } from './SessionChartsView'
import { ImageChartsView } from './ImageChartsView'
import { LabelingChartsView } from './LabelingChartsView'
import { CameraChartsView } from './CameraChartsView'
import type { StaticsViewProps } from './types'
import { Stack, Text } from '@ingradient/ui/primitives'

type SectionKey = 'sessions' | 'images' | 'labeling' | 'camera'

export function StaticsView(props: StaticsViewProps): JSX.Element {
  const {
    hasDataset, loading, imagesLoading,
    session, enhancedImage, classNameMap, classes, images,
    collapsedSections, trendMode, labels,
    onToggleSection, onTrendModeChange,
  } = props
  const sectionId = useId()
  void classNameMap

  if (!hasDataset) {
    return (
      <Container><EmptyState>{labels.selectDataset}</EmptyState></Container>
    )
  }

  if ((loading || imagesLoading) && !session && !enhancedImage) {
    return <Container><EmptyState>{labels.loading}</EmptyState></Container>
  }

  const hasSession = !!session && session.summary.total_sessions > 0
  const hasImage = !!enhancedImage && enhancedImage.total_images > 0

  if (!hasSession && !hasImage) {
    return (
      <Container>
        <Header>
          <Stack gap="var(--ig-spacing-8)">
            <Title>{labels.title}</Title>
            <Text as="div" size="var(--ig-text-caption)" tone="soft">{labels.trackedFromVersion}</Text>
          </Stack>
        </Header>
        <EmptyState>{labels.noData}</EmptyState>
      </Container>
    )
  }

  const renderSection = (key: SectionKey, label: string) => {
    const isOpen = !collapsedSections[key]
    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon
    return (
      <SectionHeader type="button" aria-expanded={isOpen} aria-controls={`${sectionId}-${key}`} onClick={() => onToggleSection(key)}>
        <Icon size={iconSizeNumbers.lg} />{label}
      </SectionHeader>
    )
  }

  const subtitleTail = session?.summary.tracked_since
    ? ` ${labels.startedSince(session.summary.tracked_since)}`
    : ''

  return (
    <Container>
      <Header>
        <Stack gap="var(--ig-spacing-8)">
          <Title>{labels.title}</Title>
          <Text as="div" size="var(--ig-text-caption)" tone="soft">{labels.trackedFromVersion}{subtitleTail}</Text>
        </Stack>
      </Header>

      {/* Keep the compact raised Card composition: StatCard fixes dashboard
          padding, XL radius and 3XL value typography and has no density variant. */}
      <SummaryGrid>
        {hasSession && session && (
          <>
            <Card elevation="raised" flat padding="var(--ig-spacing-12) var(--ig-spacing-16)"><SummaryLabel>{labels.dailyCaptures}</SummaryLabel><Text as="div" size="var(--ig-text-display)" weight="bold">{session.summary.daily_count}</Text></Card>
            <Card elevation="raised" flat padding="var(--ig-spacing-12) var(--ig-spacing-16)"><SummaryLabel>{labels.weeklyCaptures}</SummaryLabel><Text as="div" size="var(--ig-text-display)" weight="bold">{session.summary.weekly_count}</Text></Card>
            <Card elevation="raised" flat padding="var(--ig-spacing-12) var(--ig-spacing-16)"><SummaryLabel>{labels.monthlyCaptures}</SummaryLabel><Text as="div" size="var(--ig-text-display)" weight="bold">{session.summary.monthly_count}</Text></Card>
          </>
        )}
        {hasImage && enhancedImage && (
          <>
            <Card elevation="raised" flat padding="var(--ig-spacing-12) var(--ig-spacing-16)"><SummaryLabel>{labels.totalImages}</SummaryLabel><Text as="div" size="var(--ig-text-display)" weight="bold">{enhancedImage.total_images}</Text></Card>
            <Card elevation="raised" flat padding="var(--ig-spacing-12) var(--ig-spacing-16)"><SummaryLabel>{labels.labeledRatio}</SummaryLabel><Text as="div" size="var(--ig-text-display)" weight="bold">{(enhancedImage.labeled_ratio * 100).toFixed(0)}%</Text></Card>
          </>
        )}
      </SummaryGrid>

      {hasSession && session && (
        <>
          {renderSection('sessions', labels.sessions)}
          <SectionContent id={`${sectionId}-sessions`} hidden={!!collapsedSections.sessions} $collapsed={!!collapsedSections.sessions}>
            <SessionChartsView
              countsByHour={session.counts_by_hour}
              outcomeRatios={session.outcome_ratios}
              durationSummary={session.duration_summary}
              labelingDurationSummary={session.labeling_duration_summary}
              stepBreakdown={session.step_breakdown}
              workerStats={session.worker_stats}
              labels={labels.sessionCharts}
            />
          </SectionContent>
        </>
      )}

      {hasImage && enhancedImage && (
        <>
          {renderSection('images', labels.images)}
          <SectionContent id={`${sectionId}-images`} hidden={!!collapsedSections.images} $collapsed={!!collapsedSections.images}>
            <ImageChartsView data={enhancedImage} labels={labels.imageCharts} />
          </SectionContent>
          {renderSection('labeling', labels.labeling)}
          <SectionContent id={`${sectionId}-labeling`} hidden={!!collapsedSections.labeling} $collapsed={!!collapsedSections.labeling}>
            <LabelingChartsView
              data={enhancedImage}
              classNameMap={classNameMap}
              classes={classes}
              images={images}
              trendMode={trendMode}
              labels={labels.labelingCharts}
              onTrendModeChange={onTrendModeChange}
            />
          </SectionContent>
          {renderSection('camera', labels.camera)}
          <SectionContent id={`${sectionId}-camera`} hidden={!!collapsedSections.camera} $collapsed={!!collapsedSections.camera}>
            <CameraChartsView data={enhancedImage} labels={labels.cameraCharts} />
          </SectionContent>
        </>
      )}
    </Container>
  )
}
