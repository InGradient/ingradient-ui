import styled from 'styled-components';

export const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-space-4);
`;

export const DurationLabel = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
  margin-bottom: var(--ig-space-2);
`;

export const DurationValue = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-3xl);
  font-weight: var(--ig-font-weight-bold);
`;
