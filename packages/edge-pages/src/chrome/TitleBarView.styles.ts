import styled from 'styled-components'

export const Bar = styled.div`
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background: var(--ig-color-surface-header);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  backdrop-filter: blur(14px);
  -webkit-app-region: drag;
  user-select: none;
`

export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 var(--ig-space-5);
  flex-shrink: 0;
  -webkit-app-region: no-drag;
`

export const LogoImg = styled.img`
  width: 18px;
  height: 18px;
  border-radius: var(--ig-radius-2xs);
  opacity: 0.9;
`

export const LogoText = styled.span`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  letter-spacing: 0.01em;
  opacity: 0.85;
`

export const DragRegion = styled.div`
  flex: 1;
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  -webkit-app-region: no-drag;
`

export const Btn = styled.button<{ $variant?: 'close' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'close' ? 'rgba(196, 43, 28, 0.9)' : 'var(--ig-color-surface-interactive)'};
    color: var(--ig-color-text-primary);
  }
  &:active {
    background: ${({ $variant }) =>
      $variant === 'close' ? 'rgba(196, 43, 28, 1)' : 'var(--ig-color-border-subtle)'};
  }
`
