import styled from 'styled-components';

export const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-space-4);
`;

export const DurationCard = styled.div`
  background: var(--ig-color-white-04);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-5);
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

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: 0 0 var(--ig-space-4);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`;

export const Td = styled.td`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  padding: var(--ig-space-4) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-white-06);
`;
