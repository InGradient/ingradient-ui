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

export const SegmentBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  height: var(--ig-control-height-xs-plus);
  border: none;
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  transition: background var(--ig-motion-swift), color var(--ig-motion-swift);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-90)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  &:hover {
    color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-primary)')};
  }
`;

export const List = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2px);
`;

export const Item = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3) var(--ig-space-4);
  border: var(--ig-border-1px) solid ${(p) => (p.$active ? 'var(--ig-color-blue-tint-70)' : 'transparent')};
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-selection-bg)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--ig-motion-fastest);
  &:hover {
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-20)' : 'var(--ig-color-white-06)')};
  }
`;

export const Empty = styled.div`
  padding: var(--ig-space-6) var(--ig-space-4);
  text-align: center;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
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
