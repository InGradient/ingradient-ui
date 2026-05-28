import styled from 'styled-components'

export const InfoRow = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  align-items: baseline;
  min-width: 0;
`

export const InfoRowLabel = styled.span`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  flex-shrink: 0;
  min-width: var(--ig-popup-3xs);
`

export const InfoRowValue = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  flex-wrap: wrap;
`
