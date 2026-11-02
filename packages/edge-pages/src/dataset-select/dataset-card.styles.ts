import styled from 'styled-components'
import { withSurfaceDepth } from '@ingradient/ui/primitives'
import { chartColors } from '@ingradient/ui'
import { MenuIconButton } from '@ingradient/ui/components'
import { edgeGeometry } from '../geometry'

/** Recent dataset card: the card itself is the button (no inner controls). Its corners follow surface depth. */
const RecentCardBase = styled.button<{ $isLatest?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ig-spacing-4);
  padding: var(--ig-spacing-12) var(--ig-spacing-16);
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-55)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-10)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  flex-shrink: 0;
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-sm);
  min-height: ${edgeGeometry.datasetCardMinHeight};
  position: relative;
  transition: background var(--ig-motion-swift), border-color var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-selection-bg);
    border-color: var(--ig-color-blue-tint-50);
  }
`
export const RecentCard = withSurfaceDepth(RecentCardBase, { displayName: 'RecentCard' })

export const Spacer = styled.span`
  flex: 1;
`

const DatasetCardBase = styled.div<{ $isRecent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ig-spacing-4);
  padding: var(--ig-spacing-16) var(--ig-spacing-16);
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-50)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-08)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  position: relative;
  min-height: ${edgeGeometry.datasetCardRecentMinHeight};
  transition: background var(--ig-motion-swift), border-color var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-accent-soft-surface);
    border-color: var(--ig-color-blue-tint-50);
  }
`
export const DatasetCard = withSurfaceDepth(DatasetCardBase, { displayName: 'DatasetCard' })

// A stretched native selection button and a sibling kebab keep keyboard and
// pointer activation independent without nesting interactive controls.
/** Invisible stretched button that makes the whole card clickable while the card menu stays a sibling control (no nested interactive elements). */
export const DatasetSelectButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  &::after { content: ''; position: absolute; inset: 0; border-radius: inherit; }
  &:focus-visible { outline: none; }
  &:focus-visible::after {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-spacing-2);
  }
`

export const DatasetMenuTrigger = styled(MenuIconButton)`
  position: relative;
  z-index: calc(var(--ig-z-base) + 1);
`

export const DatasetName = styled.div`
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-height: var(--ig-line-height-tight);
  overflow-wrap: anywhere;
`

export function edgeTaskTagStyle($type: string): { bg: string; color: string } {
  if ($type === 'classification') return { bg: 'var(--ig-color-tag-classification-bg)', color: chartColors.tagClassification }
  if ($type === 'segmentation')   return { bg: 'var(--ig-color-tag-segmentation-bg)', color: chartColors.tagSegmentation }
  return { bg: 'var(--ig-color-blue-tint-15)', color: 'var(--ig-color-accent-soft)' }
}

export const EDGE_TASK_TAG: Record<string, string> = {
  classification: 'CLS',
  object_detection: 'OD',
  segmentation: 'Seg',
  point: 'PT',
}

export const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: auto;
  gap: var(--ig-spacing-8);
`

export const ImageCount = styled.div`
  font-size: var(--ig-text-micro);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
`

export const ClassChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-spacing-4);
  font-size: var(--ig-text-micro);
  font-weight: var(--ig-font-weight-semibold);
  padding: var(--ig-spacing-2) var(--ig-spacing-8);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => `${p.$color}22`};
  color: var(--ig-color-text-primary);
  border: var(--ig-border-1px) solid ${(p) => `${p.$color}44`};
  white-space: nowrap;
  max-width: var(--ig-text-clamp-mid);
`

export const ClassChipName = styled.span`
  max-width: var(--ig-text-clamp-narrow);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ClassChipDot = styled.span<{ $color: string }>`
  width: var(--ig-size-dot-xs);
  height: var(--ig-size-dot-xs);
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`
