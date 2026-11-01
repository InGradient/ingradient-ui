import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ig-color-bg-canvas);
`

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-spacing-24);
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-32);
`

export const ErrorMsg = styled.div`
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-danger);
  padding: var(--ig-spacing-24) 0;
  text-align: center;
`

export const Spinner = styled.div`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-text-body);
  padding: var(--ig-spacing-32) 0;
  text-align: center;
`
