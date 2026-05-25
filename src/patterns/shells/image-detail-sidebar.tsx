import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Box, Stack, Text } from '../../primitives'

const SIDEBAR_ROOT_STYLE = {
  height: '100%',
  background: 'var(--ig-color-surface-panel)',
  overflow: 'hidden' as const,
}

const FIXED_TOP_STYLE = { flexShrink: 0 }

const GROW_SECTION_STYLE = {
  flex: '1 1 0',
  overflowY: 'auto' as const,
  padding: 'var(--ig-space-5)',
  borderBottom: '1px solid var(--ig-color-border-subtle)',
}

const FixedSection = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  padding: var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  &:last-child {
    border-bottom: none;
  }
`

export interface ImageDetailSidebarProps {
  /** Top — Info panel (보통 `<ImageDetailInfoPanel>`). flex-shrink:0. */
  infoPanel: ReactNode
  /**
   * 가운데 — Class section. 남은 공간을 차지하고 내부 스크롤.
   * 없으면 미렌더.
   */
  classSlot?: ReactNode
  classSectionTitle?: string
  /**
   * 하단 고정 — Comments section. 없으면 미렌더.
   * Labelers 슬롯과 같이 자체 collapsible header 를 가지는 콘텐츠
   * (`CommentsPanel`) 가 들어오는 것을 가정해 wrapper 가 title 을 추가하지 않음.
   */
  commentsSlot?: ReactNode
  /**
   * 하단 고정 — Labelers / user filter 섹션. 없으면 미렌더.
   * 다른 슬롯과 달리 자체 header 를 가지는 콘텐츠 (e.g. `ImageDetailLabelersList`) 가
   * 들어오는 것을 가정해 wrapper 가 title 을 추가하지 않음.
   */
  labelersSlot?: ReactNode
  className?: string
}

/**
 * `MediaDialogShell` 의 sidebar slot 에 들어가는 표준 image detail 사이드바.
 * 레이아웃:
 * - 위 (고정): Info panel
 * - 가운데 (flex-grow + 내부 스크롤): Class
 * - 아래 (고정): Comments + Labelers
 *
 * platform 의 `ImageDetailSidePanel` + `SidebarScroll` / `SidebarScrollInner`
 * 구조와 동일.
 */
export function ImageDetailSidebar({
  infoPanel,
  classSlot,
  classSectionTitle = 'Class',
  commentsSlot,
  labelersSlot,
  className,
}: ImageDetailSidebarProps) {
  return (
    <Stack as="aside" gap={0} className={className} style={SIDEBAR_ROOT_STYLE}>
      <Box style={FIXED_TOP_STYLE}>{infoPanel}</Box>
      {classSlot ? (
        <Stack gap={3} style={GROW_SECTION_STYLE}>
          <Text size="var(--ig-font-size-sm)" weight={600} tone="muted" uppercase letterSpacing="0.04em">{classSectionTitle}</Text>
          {classSlot}
        </Stack>
      ) : null}
      {commentsSlot ? <FixedSection>{commentsSlot}</FixedSection> : null}
      {labelersSlot ? <FixedSection>{labelersSlot}</FixedSection> : null}
    </Stack>
  )
}
