import styled from 'styled-components'

export const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  --ig-catalog-divider-color: var(--ig-color-border-strong);
`

export const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`

export const StatusArea = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 320px;
  display: grid;
  place-items: center;
  padding: var(--ig-space-7);
`
