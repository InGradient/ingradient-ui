import styled from 'styled-components'

/** Scrollable dialog body shared by the app-shell dialogs. */
export const DialogScrollBody = styled.div`
  max-height: 60vh;
  min-height: 0;
  overflow: auto;
`

export const DialogHint = styled.p`
  margin: 0;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
`

export const RowList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
  margin: 0;
  padding: 0;
  list-style: none;
`

export const RowCard = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ig-spacing-12);
  padding: var(--ig-spacing-12);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-lg);
  background: var(--ig-color-white-04);
`

export const RowMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--ig-spacing-4);
  min-width: 0;
`

export const RowTitle = styled.div`
  overflow: hidden;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  font-weight: var(--ig-font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RowText = styled.div`
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  word-break: break-word;
`

export const RowMeta = styled.div`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
`

export const RowActions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  gap: var(--ig-spacing-8);
`

/** Whole-row button used when the row itself is the action. */
export const RowButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: var(--ig-spacing-12);
  width: 100%;
  padding: var(--ig-spacing-12);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-lg);
  background: var(--ig-color-white-04);
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  &:hover {
    border-color: var(--ig-color-accent-border-strong);
    background: var(--ig-color-accent-soft-surface);
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-spacing-2);
  }
`

export const RowThumb = styled.img`
  flex-shrink: 0;
  width: calc(var(--ig-spacing-48) * 2);
  height: calc(var(--ig-spacing-48) * 2);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-surface-muted);
  object-fit: cover;
`

export const RowAuthor = styled.span`
  margin-right: var(--ig-spacing-4);
  color: var(--ig-color-text-primary);
  font-weight: var(--ig-font-weight-semibold);
`
