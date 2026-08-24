import styled from 'styled-components'

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
