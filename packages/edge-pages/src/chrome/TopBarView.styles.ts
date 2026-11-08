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
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-text-muted);
  opacity: var(--ig-opacity-faded);
`

