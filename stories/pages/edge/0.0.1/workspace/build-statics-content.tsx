// StaticsView 합성 content. Workspace 전체 화면 스토리의 Statics 탭 슬롯에서 사용한다.
// collapsedSections / trendMode 를 내부 useState 로 관리해 토글 동작을 재현한다.
import { useState } from 'react'
import { StaticsView, type TrendMode } from '@ingradient/edge-pages'
import {
  SAMPLE_SESSION_ANALYTICS,
  SAMPLE_IMAGE_ANALYTICS,
  STATICS_LABELS,
} from '../../../../fixtures/edge/0.0.1/statics-data'

type SectionKey = 'sessions' | 'images' | 'labeling' | 'camera'

const CLASSES: { class_id: string; class_name: string; color: string }[] = [
  { class_id: 'cls-scratch', class_name: 'Scratch', color: '#ef4444' },
  { class_id: 'cls-dent', class_name: 'Dent', color: '#f59e0b' },
  { class_id: 'cls-crack', class_name: 'Crack', color: '#3b82f6' },
  { class_id: 'cls-stain', class_name: 'Stain', color: '#10b981' },
]

const CLASS_NAME_MAP = new Map<string, string>(
  CLASSES.map((c) => [c.class_id, c.class_name]),
)

export function StaticsContent(): JSX.Element {
  const [collapsedSections, setCollapsedSections] = useState<
    Partial<Record<SectionKey, boolean>>
  >({})
  const [trendMode, setTrendMode] = useState<TrendMode>('daily7')

  const onToggleSection = (key: SectionKey): void => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <StaticsView
      hasDataset
      loading={false}
      imagesLoading={false}
      session={SAMPLE_SESSION_ANALYTICS}
      enhancedImage={SAMPLE_IMAGE_ANALYTICS}
      classNameMap={CLASS_NAME_MAP}
      classes={CLASSES}
      images={[]}
      collapsedSections={collapsedSections}
      trendMode={trendMode}
      labels={STATICS_LABELS}
      onToggleSection={onToggleSection}
      onTrendModeChange={setTrendMode}
    />
  )
}
