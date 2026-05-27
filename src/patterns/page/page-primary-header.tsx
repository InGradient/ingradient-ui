import React from 'react'
import { Text } from '../../primitives'
import {
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
} from './page-shell'

const RIGHT_SLOT_STYLE = { flexShrink: 0 }

export interface PagePrimaryHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** 기본 우측 슬롯 — 보통 project name 등의 컨텍스트 문자열. */
  rightSlot?: React.ReactNode
  className?: string
}

/**
 * Platform 페이지 (Catalog / ClassManage 등) 의 hero-style top header.
 * 좌측: PageTitleBlock (title + subtitle, 2xl 타이포)
 * 우측: rightSlot (project name 등)
 */
export function PagePrimaryHeader({
  title,
  subtitle,
  rightSlot,
  className,
}: PagePrimaryHeaderProps) {
  return (
    <PageHeader className={className} data-ig-component="PagePrimaryHeader" data-ig-layer="patterns">
      <PageHeaderRow>
        <PageTitleBlock>
          <PageTitle>{title}</PageTitle>
          {subtitle ? <PageSubtitle>{subtitle}</PageSubtitle> : null}
        </PageTitleBlock>
        {rightSlot ? (
          <Text as="span" size="var(--ig-font-size-lg)" weight={700} tone="secondary" align="right" style={RIGHT_SLOT_STYLE}>
            {rightSlot}
          </Text>
        ) : null}
      </PageHeaderRow>
    </PageHeader>
  )
}
