import React from 'react'
import {
  CoordReadoutRoot,
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
  /** Trailing slot — actions 뒤. 가로 placement 면 오른쪽 끝, 세로면 아래 끝. */
  trailing?: React.ReactNode
  /** Toolbar 배치 방향. 모두 inline flex (canvas 와 겹치지 않음).
   *  - `'bottom'` (default) / `'top'`: 가로 row.
   *  - `'left'` / `'right'`: 세로 column. */
  placement?: 'bottom' | 'top' | 'left' | 'right'
  /** 버튼 사이즈. default `'md'` (40px) / `'sm'` (36px). */
  size?: 'sm' | 'md'
  className?: string
  /** ARIA toolbar label — 복수 toolbar 시 unique 보장. */
  ariaLabel?: string
}

export function AnnotationToolbar({
  actions,
  trailing,
  placement = 'bottom',
  size = 'md',
  className,
  ariaLabel,
}: AnnotationToolbarProps) {
  const orientation = placement === 'left' || placement === 'right' ? 'vertical' : 'horizontal'
  return (
    <ToolbarRoot
      $placement={placement}
      role="toolbar"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      className={className}
    >
      {actions.map((action, idx) =>
        action === 'separator' ? (
          <Separator key={`sep-${idx}`} $placement={placement} aria-hidden />
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
      {trailing ? <TrailingArea $placement={placement}>{trailing}</TrailingArea> : null}
    </ToolbarRoot>
  )
}

/** Coord readout — toolbar 와 분리된 별도 컴포넌트. canvas 아래 sibling 으로 배치하여
 *  toolbar placement 와 무관하게 항상 canvas 아래에 표시. */
export function CanvasCoordReadout({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <CoordReadoutRoot
      className={className}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {children}
    </CoordReadoutRoot>
  )
}
