import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--ig-space-8);
  background: var(--ig-color-bg-canvas);
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--ig-space-7);
  margin-bottom: 18px;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-3xl);
`;

export const Subtitle = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--ig-space-5);
  margin-bottom: var(--ig-space-7);
`;

export const SummaryCard = styled.div`
  background: var(--ig-color-surface-panel);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  padding: var(--ig-space-6) 16px;
`;

export const SummaryLabel = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
  margin-bottom: var(--ig-space-3);
`;

export const SummaryValue = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-4xl);
  font-weight: var(--ig-font-weight-bold);
`;

export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--ig-space-6);
`;

export const Panel = styled.div`
  background: var(--ig-color-surface-panel);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-6) 16px 16px;
  min-height: 300px;
`;

export const PanelTitle = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  margin-bottom: var(--ig-space-5);
`;

export const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--ig-space-4) 0;
  margin-top: var(--ig-space-5);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-bold);
  text-align: left;
  &:hover { color: var(--ig-color-text-soft); }
`;

export const SectionContent = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

