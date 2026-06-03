import styled from 'styled-components'

export const RecentCard = styled.button<{ $isLatest?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--ig-space-1);
  padding: var(--ig-space-6) 16px;
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-55)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isLatest ? 'var(--ig-color-blue-tint-10)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  flex-shrink: 0;
  min-width: var(--ig-popup-xs);
  max-width: var(--ig-popup-sm);
  min-height: 112px;
  position: relative;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: var(--ig-color-blue-tint-14);
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
  padding: var(--ig-space-7) 18px;
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-50)' : 'var(--ig-color-white-12)')};
  background: ${(p) => (p.$isRecent ? 'var(--ig-color-blue-tint-08)' : 'var(--ig-color-white-04)')};
  cursor: pointer;
  text-align: left;
  position: relative;
  min-height: 108px;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: var(--ig-color-blue-tint-12);
    border-color: var(--ig-color-blue-tint-50);
  }
`

export const DatasetNameRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--ig-space-2);
  width: 100%;
  min-width: 0;
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
  line-height: 1.35;
  overflow-wrap: anywhere;
`

export const EdgeDatasetTaskTag = styled.span<{ $type: string }>`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: var(--ig-space-1px) var(--ig-space-2);
  border-radius: var(--ig-radius-2xs);
  letter-spacing: var(--ig-letter-spacing-tight);
  flex-shrink: 0;
  white-space: nowrap;
  background: ${(p) =>
    p.$type === 'classification' ? 'rgba(110,200,122,0.15)' :
    p.$type === 'segmentation'   ? 'rgba(180,120,230,0.15)' :
                                   'var(--ig-color-blue-tint-15)'};
  color: ${(p) =>
    p.$type === 'classification' ? '#6ec87a' :
    p.$type === 'segmentation'   ? '#c07be8' :
                                   'var(--ig-color-accent)'};
`

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

export const ClassChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-1);
  justify-content: flex-end;
`

export const ClassChip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: 2px 7px;
  border-radius: 99px;
  background: ${(p) => `${p.$color}22`};
  color: ${(p) => p.$color};
  border: var(--ig-border-1px) solid ${(p) => `${p.$color}44`};
  white-space: nowrap;
  max-width: 8em;
`

export const ClassChipName = styled.span`
  max-width: 5.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ClassChipDot = styled.span<{ $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`

export const MoreChip = styled.span`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: 2px 7px;
  border-radius: 99px;
  background: var(--ig-color-white-06);
  color: var(--ig-color-text-muted);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
`

export const DatasetProjectLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
`

export const RecentBadge = styled.div`
  flex-shrink: 0;
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  padding: var(--ig-space-2px) var(--ig-space-2);
  border-radius: var(--ig-radius-2xs);
  background: var(--ig-color-blue-tint-20);
  color: var(--ig-color-accent);
  white-space: nowrap;
`
