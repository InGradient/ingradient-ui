import styled from 'styled-components'
import { chartColors } from '@ingradient/ui'

export const RecentCard = styled.button<{ $isLatest?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ig-space-1);
  padding: var(--ig-space-6) var(--ig-space-7);
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-55)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-10)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  flex-shrink: 0;
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-sm);
  min-height: var(--ig-layout-dataset-card-min-height);
  position: relative;
  transition: background var(--ig-motion-swift), border-color var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-selection-bg);
    border-color: var(--ig-color-blue-tint-50);
  }
`

export const Spacer = styled.span`
  flex: 1;
`

export const DatasetCard = styled.div<{ $isRecent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ig-space-1);
  padding: var(--ig-space-7) var(--ig-space-8);
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-50)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-08)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  position: relative;
  min-height: var(--ig-layout-dataset-card-recent-min-height);
  transition: background var(--ig-motion-swift), border-color var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-accent-soft-surface);
    border-color: var(--ig-color-blue-tint-50);
  }
`

export const DatasetName = styled.div`
  font-size: var(--ig-font-size-md);
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
  return { bg: 'var(--ig-color-blue-tint-15)', color: 'var(--ig-color-accent)' }
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
  gap: var(--ig-space-2);
`

export const ImageCount = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
`

export const ClassChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: var(--ig-space-2px) var(--ig-space-2-plus);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => `${p.$color}22`};
  color: ${(p) => p.$color};
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
  width: var(--ig-space-1-plus);
  height: var(--ig-space-1-plus);
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`
