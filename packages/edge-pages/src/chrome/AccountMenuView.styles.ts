import styled from 'styled-components'

export const AccountBtn = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  height: var(--ig-control-height-md);
  padding: 0 var(--ig-space-4);
  border: var(--ig-border-1px) solid transparent;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-medium);
  white-space: nowrap;
  transition: all var(--ig-motion-fast-ease);
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-surface-interactive);
    border-color: var(--ig-color-border-subtle);
  }
`

export const AccountBtnName = styled.span`
  max-width: var(--ig-popup-3xs);
  overflow: hidden;
  text-overflow: ellipsis;
`

export const AccountMenuWrap = styled.div`
  position: relative;
`

export const AccountDropdown = styled.div`
  position: absolute;
  top: calc(100% + var(--ig-space-2));
  right: 0;
  min-width: var(--ig-popup-list-min);
  padding: var(--ig-space-2);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-panel);
  z-index: var(--ig-z-dropdown, 1000);
`

export const AccountMenuEmail = styled.div`
  padding: var(--ig-space-3) var(--ig-space-5) var(--ig-space-2);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-space-1);
  user-select: none;
`

export const AccountMenuItem = styled.button`
  display: block;
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-5);
  text-align: left;
  border: var(--ig-border-1px) solid transparent;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  &:hover { background: var(--ig-color-surface-interactive); color: var(--ig-color-text-primary); }
`

export const AccountMenuDanger = styled(AccountMenuItem)`
  color: var(--ig-color-danger);
  &:hover { color: var(--ig-color-danger); background: var(--ig-color-danger-bg-soft); }
`

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

export const HistoryEntry = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: var(--ig-space-4) var(--ig-space-6);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  background: transparent;
  cursor: pointer;
  transition: all var(--ig-motion-swift);
  text-align: left;
  &:hover { background: var(--ig-color-surface-interactive); border-color: var(--ig-color-border-strong); }
`

export const HistoryName = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-medium);
  color: var(--ig-color-text-primary);
`

export const HistoryEmail = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin-top: var(--ig-space-2px);
`

export const ModalEmptyText = styled.p`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-5) 0;
`

export const ModalCancelBtn = styled.button`
  margin-top: var(--ig-space-6);
  width: 100%;
  padding: var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`
