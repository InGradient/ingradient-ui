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
  padding: var(--ig-space-11);
  display: flex;
  flex-direction: column;
  gap: 28px;
`

export const SectionLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const ErrorMsg = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-danger);
  padding: 24px 0;
  text-align: center;
`

export const Spinner = styled.div`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-md);
  padding: 32px 0;
  text-align: center;
`
