import styled from 'styled-components';

export const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-spacing-8);
`;

export const DurationLabel = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-text-caption);
  margin-bottom: var(--ig-spacing-8);
`;

export const DurationValue = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-title);
  font-weight: var(--ig-font-weight-bold);
`;
