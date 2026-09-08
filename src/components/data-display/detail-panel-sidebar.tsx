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
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}

const FixedSection = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  padding: var(--ig-space-5);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  &:last-child {
    border-bottom: none;
  }
`

export interface DetailPanelSidebarProps {
  /** 고정된 상단 슬롯. flex-shrink:0. */
  headerSlot: ReactNode
  /** 가운데 — 남은 공간을 차지하고 내부 스크롤. 없으면 미렌더. */
  bodySlot?: ReactNode
  /** body 슬롯 상단의 섹션 타이틀. */
  bodySectionTitle?: string
  /**
   * 하단 고정 슬롯 배열. 각 항목이 자체 FixedSection 으로 렌더된다.
   * 자체 header 를 가지는 콘텐츠가 들어오는 것을 가정해 wrapper 가 title 을 추가하지 않음.
   */
  footerSlots?: ReactNode[]
  className?: string
}

export function DetailPanelSidebar({
  headerSlot,
  bodySlot,
  bodySectionTitle = 'Section',
  footerSlots,
  className,
}: DetailPanelSidebarProps) {
  return (
    <Stack as="div" gap={0} className={className} style={SIDEBAR_ROOT_STYLE}>
      <Box style={FIXED_TOP_STYLE}>{headerSlot}</Box>
      {bodySlot ? (
        <Stack gap={3} tabIndex={0} style={GROW_SECTION_STYLE}>
          <Text size="var(--ig-font-size-sm)" weight="semibold" tone="muted" uppercase letterSpacing="normal">{bodySectionTitle}</Text>
          {bodySlot}
        </Stack>
      ) : null}
      {footerSlots?.map((slot, i) => (slot ? <FixedSection key={i}>{slot}</FixedSection> : null))}
    </Stack>
  )
}
