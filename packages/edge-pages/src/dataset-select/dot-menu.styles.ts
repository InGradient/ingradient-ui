import styled from 'styled-components'

export const DotsBtnWrap = styled.div`
  position: relative;
`

export const DotsBtn = styled.button`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  border: none;
  background: transparent;
  color: var(--ig-color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s, color 0.15s;
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
  top: 32px;
  right: 8px;
  z-index: 201;
  background: var(--ig-color-surface-panel);
  border: 1px solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-xs);
  padding: 4px 0;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
`

export const DotMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  text-align: left;
  &:hover { background: var(--ig-color-white-06); color: var(--ig-color-text-primary); }
`
