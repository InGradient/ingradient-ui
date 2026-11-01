import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--ig-spacing-16);
  background: var(--ig-color-bg-canvas);
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--ig-spacing-16);
  margin-bottom: var(--ig-spacing-16);
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-title);
`;

export const Subtitle = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-text-caption);
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--ig-spacing-12);
  margin-bottom: var(--ig-spacing-16);
`;

export const SummaryLabel = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-text-caption);
  margin-bottom: var(--ig-spacing-8);
`;

export const SummaryValue = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-display);
  font-weight: var(--ig-font-weight-bold);
`;

export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--ig-spacing-12);
`;

export const PanelTitle = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-bold);
  margin-bottom: var(--ig-spacing-12);
`;

export const SectionHeader = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--ig-spacing-8) 0;
  margin-top: var(--ig-spacing-12);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-title-sm);
  font-weight: var(--ig-font-weight-bold);
  text-align: left;
  &:hover { color: var(--ig-color-text-soft); }
`;

export const SectionContent = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

