import React from 'react'
import {
  Separator,
  ToolbarButton,
  ToolbarRoot,
  TrailingArea,
} from './toolbar-shell.styles'

export interface ToolbarShellAction {
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

export interface ToolbarShellProps {
  /** Action 버튼 배열. 문자열 `'separator'` 가 섞여 있으면 구분자 표시. */
  actions: Array<ToolbarShellAction | 'separator'>
  /** Trailing slot — actions 뒤. 가로 placement 면 오른쪽 끝, 세로면 아래 끝. */
  trailing?: React.ReactNode
  /** Toolbar 배치 방향. 모두 inline flex (sibling 와 overlap 없음).
   *  - `'bottom'` (default) / `'top'`: 가로 row.
   *  - `'left'` / `'right'`: 세로 column. */
  placement?: 'bottom' | 'top' | 'left' | 'right'
  /** 버튼 사이즈. default `'md'` (40px) / `'sm'` (36px). */
  size?: 'sm' | 'md'
  className?: string
  /** ARIA toolbar label — 복수 toolbar 시 unique 보장. */
  ariaLabel?: string
}

/**
 * Generic toolbar shell — actions array + optional trailing slot + 4-placement.
 * Canvas / image-viewer / 일반 toolbar 어디서나 재사용 가능한 작업 모음 컨테이너.
 */
export function ToolbarShell({
  actions,
  trailing,
  placement = 'bottom',
  size = 'md',
  className,
  ariaLabel,
}: ToolbarShellProps) {
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
