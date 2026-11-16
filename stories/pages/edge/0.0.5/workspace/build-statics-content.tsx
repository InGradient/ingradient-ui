// [임시] Statics 탭 — 촬영·라벨링 집계 차트.
// 숫자는 전부 mock 이다. 실제 집계로 바꿀 때 fixture 만 갈아 끼우면 된다.
import { useState } from 'react'
import { StaticsView, type LiveRange, type StaticsSectionKey, type TrendMode } from '@ingradient/edge-pages'
import {
  LIVE_STATS_LABELS, SAMPLE_IMAGE_ANALYTICS, SAMPLE_SESSION_ANALYTICS, STATICS_LABELS, liveAxisUtc, sampleLiveStats,
} from '../../../../fixtures/edge/0.0.5'
import { PANEL_CLASSES } from '../../../../fixtures/edge/0.0.5/workspace'

const CLASS_NAME_MAP = new Map<string, string>(
  PANEL_CLASSES.map((c) => [c.class_id, c.class_name]),
)

/** `live`: the real app's Live status section (0.0.6 stories only). */
export function StaticsContent({ live = false }: { live?: boolean } = {}): JSX.Element {
  const [collapsedSections, setCollapsedSections] = useState<Partial<Record<StaticsSectionKey, boolean>>>({})
  const [range, setRange] = useState<LiveRange>('hour')
  const [trendMode, setTrendMode] = useState<TrendMode>('daily7')

  return (
    <StaticsView
      hasDataset
      loading={false}
      imagesLoading={false}
      session={SAMPLE_SESSION_ANALYTICS}
      enhancedImage={SAMPLE_IMAGE_ANALYTICS}
      classNameMap={CLASS_NAME_MAP}
      classes={PANEL_CLASSES}
      images={[]}
      collapsedSections={collapsedSections}
      trendMode={trendMode}
      labels={STATICS_LABELS}
      live={live ? {
        stats: sampleLiveStats(range), range, labels: LIVE_STATS_LABELS, onRangeChange: setRange,
        formatTime: (iso) => iso.slice(11, 19), formatAxis: liveAxisUtc,
      } : undefined}
      onToggleSection={(key) => setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }))}
      onTrendModeChange={setTrendMode}
    />
  )
}
