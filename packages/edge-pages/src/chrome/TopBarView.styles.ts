import styled from 'styled-components'
export { Spinner as ConnectingSpinner } from '@ingradient/ui/components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  color: var(--ig-color-text-primary);
`



export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-muted);
  margin-right: var(--ig-spacing-4);
  &.active { color: var(--ig-color-success); }
  &.error  { color: var(--ig-color-danger); }
`



/** Page title of the workspace (project / dataset). Heading semantics only: children own typography. */
export const BreadcrumbWrap = styled.h1`
  margin: 0;
  font: inherit;
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  padding: 0 var(--ig-spacing-8);
  border-left: var(--ig-spacing-2) solid var(--ig-color-border-subtle);
`


export const BreadcrumbSep = styled.span`
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-muted);
  opacity: var(--ig-opacity-faded);
`

