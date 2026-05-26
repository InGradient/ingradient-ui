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
  padding-bottom: 4px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--ig-color-white-12); border-radius: 2px; }
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
  font-weight: 700;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const ProjectTypeTag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-blue-tint-14);
  border: 1px solid rgba(77, 136, 255, 0.34);
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const AddDatasetBtn = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-1);
  height: 22px;
  padding: 0 8px;
  border-radius: var(--ig-radius-xs);
  border: 1px dashed rgba(77, 136, 255, 0.4);
  background: transparent;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-2xs);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
  &:hover {
    background: rgba(77, 136, 255, 0.1);
    border-style: solid;
  }
`

export const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--ig-space-4);
`
