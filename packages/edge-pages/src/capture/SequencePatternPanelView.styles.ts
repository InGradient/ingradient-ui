import { Button } from '@ingradient/ui/components'
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--ig-space-4);
  gap: var(--ig-space-4);
`;

export const Segment = styled.div`
  display: flex;
  gap: var(--ig-space-2px);
  padding: var(--ig-space-3px);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-white-06);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`;

export const SegmentBtn = styled(Button).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    flex: 1;
    border-color: transparent;
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-90)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  }
  &&:hover:not(:disabled) {
    color: var(--ig-color-text-primary);
  }
`;

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2px);
`;

export const Item = styled(Button).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    justify-content: flex-start;
    text-align: left;
    border-color: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-70)' : 'transparent')};
    background: ${(p) => (p.$active ? 'var(--ig-color-selection-bg)' : 'transparent')};
    color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  }
  &&:hover:not(:disabled) {
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-20)' : 'var(--ig-color-white-06)')};
  }
`;

/** 파생 리스트 내 sub-group 구분선 (Analysis | Geometry). */
export const SubSectionLabel = styled.div`
  padding: var(--ig-space-3) var(--ig-space-4) var(--ig-space-2);
  margin-top: var(--ig-space-3);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-widest);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`;
