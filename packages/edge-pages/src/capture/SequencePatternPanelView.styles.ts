import { Button } from '@ingradient/ui/components'
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--ig-spacing-8);
  gap: var(--ig-spacing-8);
`;

export const Segment = styled.div`
  display: flex;
  gap: var(--ig-spacing-2);
  padding: calc(var(--ig-spacing-4) - var(--ig-border-1px));
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
    background: ${(p) => (p.$active ? 'var(--ig-color-selection-bg)' : 'transparent')};
    border-color: ${(p) => (p.$active ? 'var(--ig-color-accent-ring)' : 'transparent')};
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
  gap: var(--ig-spacing-2);
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
