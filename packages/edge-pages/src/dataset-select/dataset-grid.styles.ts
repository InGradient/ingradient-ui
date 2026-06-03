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

export const ProjectTypeTag = styled.span`
  display: inline-flex;
  align-items: center;
  height: var(--ig-icon-xl);
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-blue-tint-14);
  border: var(--ig-border-1px) solid rgba(77, 136, 255, 0.34);
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-wide);
  text-transform: uppercase;
`

export const AddDatasetBtn = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-1);
  height: var(--ig-icon-2xl);
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) dashed var(--ig-color-blue-tint-40);
  background: transparent;
  color: var(--ig-color-accent);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
  &:hover {
    background: var(--ig-color-blue-tint-10);
    border-style: solid;
  }
`

export const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--ig-popup-sm), 1fr));
  gap: var(--ig-space-4);
`
