import React from 'react'
import styled from 'styled-components'
import {
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
} from './page-shell'

const RightSlot = styled.span`
  font-size: var(--ig-font-size-lg);
  font-weight: 700;
  color: var(--ig-color-text-secondary);
  text-align: right;
  flex-shrink: 0;
`

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
 *
 * 작은 fixed-height app top bar 가 필요한 경우 `PageTopBar` 사용.
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
        {rightSlot ? <RightSlot>{rightSlot}</RightSlot> : null}
      </PageHeaderRow>
    </PageHeader>
  )
}
