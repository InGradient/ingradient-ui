import styled from 'styled-components'
import { statColor } from './bottom-bar-helpers'

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

export const RightSection = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  background: none;
  border: none;
  padding: 0 var(--ig-space-2);
  cursor: pointer;
  border-radius: var(--ig-radius-sm);
  height: var(--ig-icon-2xl);
  color: var(--ig-color-text-muted);

  &:hover {
    background: var(--ig-color-surface-raised);
  }
`

export const SyncChip = styled.div<{ $status: 'syncing' | 'done' | 'error' }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-medium);
  color: ${({ $status }) =>
    $status === 'syncing'
      ? 'var(--ig-color-text-muted)'
      : $status === 'done'
        ? 'var(--ig-color-success)'
        : 'var(--ig-color-danger)'};
  user-select: none;
`

export const StatChip = styled.div<{ $pct?: number }>`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-medium);
  color: ${({ $pct }) => ($pct != null ? statColor($pct) : 'var(--ig-color-text-muted)')};
  user-select: none;
`

export const NetIcon = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  color: ${({ $connected }) => ($connected ? 'var(--ig-color-success)' : 'var(--ig-color-danger)')};
`
