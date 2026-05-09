import React from 'react'

export type GridSelectionAction = 'toggle' | 'range' | 'single'

/**
 * shift/ctrl/meta 키 감지 → action 분류.
 * caller 는 onSelectionChange 받아 본인 selectedIds 갱신 (range 시 마지막 anchor 기억은 caller 책임).
 */
export function classifySelectionAction(event: React.MouseEvent): GridSelectionAction {
  if (event.shiftKey) return 'range'
  if (event.ctrlKey || event.metaKey) return 'toggle'
  return 'single'
}
