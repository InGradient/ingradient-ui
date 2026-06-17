import {
  AnalysisClassRatioWidget,
  AnalysisDataCollectionWidget,
  AnalysisLabelingByPersonWidget,
  AnalysisLabelingStatusWidget,
  AnalysisPendingProcessedWidget,
  AnalysisTimelineWidget,
  PerDatasetDistributionWidget,
  SourceBreakdownWidget,
} from '@ingradient/platform-pages'
import {
  classRatioData,
  dataCollectionData,
  dataCollectionTotalImages,
  datasetDistribution,
  defectsBySource,
  labelingByPersonData,
  labelingStatus,
  pendingProcessed,
  timelineData,
  type DashboardWidgetKey,
} from '../../../../fixtures/platform/0.0.1/dashboard-analysis'

export function buildDashboardWidgets(): Partial<Record<DashboardWidgetKey, React.ReactNode>> {
  return {
    data_collection: (
      <AnalysisDataCollectionWidget
        totalImages={dataCollectionTotalImages}
        chartData={dataCollectionData}
      />
    ),
    timeline: <AnalysisTimelineWidget granularity="daily" chartData={timelineData} />,
    labeling_status: (
      <AnalysisLabelingStatusWidget
        totalLabeled={labelingStatus.labeled}
        totalUnlabeled={labelingStatus.unlabeled}
        totalImages={labelingStatus.total}
        labeledPct={labelingStatus.labeledPct}
        pieData={labelingStatus.pieData}
      />
    ),
    class_ratio: <AnalysisClassRatioWidget classRatio={classRatioData} chartData={classRatioData} />,
    labeling_by_person: (
      <AnalysisLabelingByPersonWidget
        byPerson={labelingByPersonData}
        chartData={labelingByPersonData.map((p) => ({
          name: p.uploader.split(' ')[0],
          fullName: p.uploader,
          images: p.image_count,
          labeled: p.labeled_count,
        }))}
      />
    ),
    defects_by_source: <SourceBreakdownWidget bySource={defectsBySource} />,
    pending_processed: (
      <AnalysisPendingProcessedWidget
        pending={pendingProcessed.pending}
        processed={pendingProcessed.processed}
        pieData={pendingProcessed.pieData}
      />
    ),
    dataset_distribution: <PerDatasetDistributionWidget datasetDistribution={datasetDistribution} />,
  }
}

export const dashboardWidgetTitles: Record<DashboardWidgetKey, string> = {
  data_collection: 'Images by dataset',
  timeline: 'Images over time',
  labeling_status: 'Labeled vs unlabeled',
  class_ratio: 'Class distribution',
  labeling_by_person: 'Uploader activity',
  defects_by_source: 'Defects by source',
  pending_processed: 'Labeling progress',
  dataset_distribution: 'Per-dataset distribution',
}

export const dashboardWidgetKeys: readonly DashboardWidgetKey[] = [
  'data_collection',
  'timeline',
  'labeling_status',
  'class_ratio',
  'labeling_by_person',
  'defects_by_source',
  'pending_processed',
  'dataset_distribution',
]
