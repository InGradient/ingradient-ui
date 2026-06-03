import styled from 'styled-components'

export const DotsBtnWrap = styled.div`
  position: relative;
`

export const DotsBtn = styled.button`
  flex-shrink: 0;
  width: var(--ig-icon-2xl);
  height: var(--ig-icon-2xl);
  border-radius: var(--ig-space-1-plus);
  border: none;
  background: transparent;
  color: var(--ig-color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background var(--ig-motion-swift), color var(--ig-motion-swift);
  position: relative;
  z-index: 2;
  &:hover { background: var(--ig-color-white-08); color: var(--ig-color-text-primary); }
`

export const DotMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
`

export const DotMenuWrap = styled.div`
  position: absolute;
  top: var(--ig-space-13);
  right: var(--ig-space-3);
  z-index: 201;
  background: var(--ig-color-surface-panel);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-1) 0;
  min-width: var(--ig-popup-2xs);
  box-shadow: 0 var(--ig-space-3) var(--ig-space-11) rgba(0,0,0,0.4);
`

export const DotMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: var(--ig-space-3) 14px;
  border: none;
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  text-align: left;
  &:hover { background: var(--ig-color-white-06); color: var(--ig-color-text-primary); }
`
