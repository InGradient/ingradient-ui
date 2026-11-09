import styled from 'styled-components'

export const RecentScroll = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--ig-spacing-8);
  overflow-x: auto;
  padding-bottom: var(--ig-spacing-4);
  &::-webkit-scrollbar { height: var(--ig-spacing-4); }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--ig-color-white-12); border-radius: var(--ig-spacing-2); }
`
