import styled, { css, keyframes } from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--ig-control-height-xl);
  padding: 0 var(--ig-space-7);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-white-08);
  flex-shrink: 0;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  min-height: 0;
`

export const Title = styled.h1`
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin: 0;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`

export const ModeTag = styled.span<{ $online: boolean }>`
  display: inline-block;
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  padding: 2px 7px;
  border-radius: var(--ig-radius-xs);
  margin-left: var(--ig-space-3);
  background: ${(p) => (p.$online ? 'var(--ig-color-green-tint-15)' : 'var(--ig-color-amber-tint-15)')};
  color: ${(p) => (p.$online ? 'var(--ig-color-success)' : 'var(--ig-color-warning)')};
  vertical-align: middle;
`

export const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block;
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  padding: var(--ig-space-2px) var(--ig-space-3);
  border-radius: var(--ig-radius-xs);
  background: ${(p) => {
    switch (p.$role) {
      case 'owner':   return 'var(--ig-color-amber-tint-15)'
      case 'manager': return 'var(--ig-color-blue-tint-15)'
      case 'labeler': return 'var(--ig-color-green-tint-15)'
      default:        return 'var(--ig-color-white-08)'
    }
  }};
  color: ${(p) => {
    switch (p.$role) {
      case 'owner':   return 'var(--ig-color-warning)'
      case 'manager': return 'var(--ig-color-accent)'
      case 'labeler': return 'var(--ig-color-success)'
      default:        return 'var(--ig-color-text-muted)'
    }
  }};
`

const spinAnim = keyframes`to { transform: rotate(360deg); }`

export const RefreshBtn = styled.button<{ $spinning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  padding: 0;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid transparent;
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: all 0.16s ease;
  flex-shrink: 0;
  svg {
    ${(p) => p.$spinning && css`animation: ${spinAnim} 0.7s linear infinite;`}
  }
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
    border-color: var(--ig-color-white-12);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  padding: 0;
  border: var(--ig-border-1px) solid transparent;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: all 0.16s ease;
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
    border-color: var(--ig-color-white-12);
  }
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
`

export const StatusDot = styled.button<{ $status: 'connected' | 'connecting' | 'disconnected' }>`
  width: var(--ig-space-5);
  height: var(--ig-space-5);
  border-radius: var(--ig-radius-pill);
  border: none;
  padding: 0;
  background: ${({ $status }) =>
    $status === 'connected'
      ? 'var(--ig-color-success)'
      : $status === 'connecting'
        ? 'var(--ig-color-warning)'
        : 'var(--ig-color-danger)'};
  box-shadow: 0 0 0 2px var(--ig-color-white-08);
  cursor: default;
`
