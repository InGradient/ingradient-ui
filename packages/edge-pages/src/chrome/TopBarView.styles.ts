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

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-7);
`

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  margin-right: var(--ig-space-1);
  &.active { color: var(--ig-color-success); }
  &.error  { color: var(--ig-color-danger); }
`


export const EdgeInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
`

export const BreadcrumbWrap = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  padding: 0 var(--ig-space-4);
  border-left: var(--ig-space-2px) solid var(--ig-color-border-subtle);
`

export const BreadcrumbProject = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
`

export const BreadcrumbSep = styled.span`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  opacity: var(--ig-opacity-faded);
`

export const BreadcrumbDataset = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
`
