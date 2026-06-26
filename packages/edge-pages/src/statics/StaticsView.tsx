import { iconSizeNumbers } from '@ingradient/ui'
import { EmptyState, ChevronDownIcon, ChevronRightIcon } from '@ingradient/ui/components'
import {
  Container, Header, TitleBlock, Title, Subtitle,
  SummaryGrid, SummaryCard, SummaryLabel, SummaryValue,
  SectionHeader, SectionContent,
} from './StaticsView.styles'
import { SessionChartsView } from './SessionChartsView'
import { ImageChartsView } from './ImageChartsView'
import { LabelingChartsView } from './LabelingChartsView'
import { CameraChartsView } from './CameraChartsView'
import type { StaticsViewProps } from './types'

type SectionKey = 'sessions' | 'images' | 'labeling' | 'camera'

export function StaticsView(props: StaticsViewProps): JSX.Element {
  const {
    hasDataset, loading, imagesLoading,
    session, enhancedImage, classNameMap, classes, images,
    collapsedSections, trendMode, labels,
    onToggleSection, onTrendModeChange,
  } = props
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
          <TitleBlock>
            <Title>{labels.title}</Title>
            <Subtitle>{labels.trackedFromVersion}</Subtitle>
          </TitleBlock>
        </Header>
        <EmptyState>{labels.noData}</EmptyState>
      </Container>
    )
  }

  const renderSection = (key: SectionKey, label: string) => {
    const isOpen = !collapsedSections[key]
    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon
    return (
      <SectionHeader onClick={() => onToggleSection(key)}>
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
        <TitleBlock>
          <Title>{labels.title}</Title>
          <Subtitle>{labels.trackedFromVersion}{subtitleTail}</Subtitle>
        </TitleBlock>
      </Header>

      <SummaryGrid>
        {hasSession && session && (
          <>
            <SummaryCard><SummaryLabel>{labels.dailyCaptures}</SummaryLabel><SummaryValue>{session.summary.daily_count}</SummaryValue></SummaryCard>
            <SummaryCard><SummaryLabel>{labels.weeklyCaptures}</SummaryLabel><SummaryValue>{session.summary.weekly_count}</SummaryValue></SummaryCard>
            <SummaryCard><SummaryLabel>{labels.monthlyCaptures}</SummaryLabel><SummaryValue>{session.summary.monthly_count}</SummaryValue></SummaryCard>
          </>
        )}
        {hasImage && enhancedImage && (
          <>
            <SummaryCard><SummaryLabel>{labels.totalImages}</SummaryLabel><SummaryValue>{enhancedImage.total_images}</SummaryValue></SummaryCard>
            <SummaryCard><SummaryLabel>{labels.labeledRatio}</SummaryLabel><SummaryValue>{(enhancedImage.labeled_ratio * 100).toFixed(0)}%</SummaryValue></SummaryCard>
          </>
        )}
      </SummaryGrid>

      {hasSession && session && (
        <>
          {renderSection('sessions', labels.sessions)}
          <SectionContent $collapsed={!!collapsedSections.sessions}>
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
          <SectionContent $collapsed={!!collapsedSections.images}>
            <ImageChartsView data={enhancedImage} labels={labels.imageCharts} />
          </SectionContent>
          {renderSection('labeling', labels.labeling)}
          <SectionContent $collapsed={!!collapsedSections.labeling}>
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
          <SectionContent $collapsed={!!collapsedSections.camera}>
            <CameraChartsView data={enhancedImage} labels={labels.cameraCharts} />
          </SectionContent>
        </>
      )}
    </Container>
  )
}
