import styled from 'styled-components'

export const RecentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const RecentScroll = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--ig-space-4);
  overflow-x: auto;
  padding-bottom: var(--ig-space-1);
  &::-webkit-scrollbar { height: var(--ig-space-1); }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--ig-color-white-12); border-radius: var(--ig-space-2px); }
`

export const ProjectSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

export const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`

export const ProjectName = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wider);
`

export const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--ig-popup-sm), 1fr));
  gap: var(--ig-space-4);
`
