import styled, { css, keyframes } from 'styled-components'

export const ProgressBarTrack = styled.div`
  height: 6px;
  border-radius: 3px;
  background: var(--ig-color-white-08);
  overflow: hidden;
`

const progressAnim = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
`

export const ProgressBarFill = styled.div<{ $done?: boolean; $error?: boolean }>`
  height: 100%;
  border-radius: 3px;
  background: ${(p) => p.$error ? 'var(--ig-color-danger)' : 'var(--ig-color-accent)'};
  ${(p) => p.$done
    ? 'width: 100%;'
    : p.$error
      ? 'width: 100%;'
      : css`width: 30%; animation: ${progressAnim} 1.2s linear infinite;`
  }
`
