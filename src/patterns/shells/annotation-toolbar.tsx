import React from 'react'
import {
  LeadingArea,
  Separator,
  ToolbarButton,
  ToolbarRoot,
  TrailingArea,
} from './annotation-toolbar.styles'

export interface AnnotationToolbarAction {
  key: string
  /** Tooltip + aria-label. */
  title: string
  icon: React.ReactNode
  /** Active toggle state (mode buttons). */
  active?: boolean
  disabled?: boolean
  /** Danger style (delete 등). */
  danger?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Optional className (e.g. mobile-only show/hide). */
  className?: string
}

export interface AnnotationToolbarProps {
  /** Action 버튼 배열. 문자열 `'separator'` 가 섞여 있으면 구분자 표시. */
  actions: Array<AnnotationToolbarAction | 'separator'>
  /** 좌측 슬롯 — 보통 CoordReadout. flex 1 차지. */
  leading?: React.ReactNode
  /** 우측 슬롯 — actions 뒤. */
  trailing?: React.ReactNode
  /** 배치. `'absolute'` (default platform image-detail) / `'inline'` (edge labeling). */
  placement?: 'absolute' | 'inline'
  /** 버튼 사이즈. default `'md'` (40px) / `'sm'` (36px). */
  size?: 'sm' | 'md'
  className?: string
  /** ARIA toolbar label — must be unique within a page if multiple toolbars share it. */
  ariaLabel?: string
}

export function AnnotationToolbar({
  actions,
  leading,
  trailing,
  placement = 'absolute',
  size = 'md',
  className,
  ariaLabel,
}: AnnotationToolbarProps) {
  return (
    <ToolbarRoot
      $placement={placement}
      role="toolbar"
      aria-label={ariaLabel}
      className={className}
    >
      {leading ? <LeadingArea>{leading}</LeadingArea> : null}
      {actions.map((action, idx) =>
        action === 'separator' ? (
          <Separator key={`sep-${idx}`} aria-hidden />
        ) : (
          <ToolbarButton
            key={action.key}
            type="button"
            $active={!!action.active}
            $danger={!!action.danger}
            $size={size}
            disabled={action.disabled}
            title={action.title}
            aria-label={action.title}
            aria-pressed={action.active}
            onClick={action.onClick}
            className={action.className}
          >
            {action.icon}
          </ToolbarButton>
        ),
      )}
      {trailing ? <TrailingArea>{trailing}</TrailingArea> : null}
    </ToolbarRoot>
  )
}
