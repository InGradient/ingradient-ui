import styled, { css } from 'styled-components'

const shimmer = css`
  background:
    linear-gradient(
      90deg,
      var(--ig-color-skeleton-start) 0%,
      var(--ig-color-skeleton-mid) 50%,
      var(--ig-color-skeleton-start) 100%
    )
    0 0 / 200% 100%;
  animation: skeletonShift var(--ig-motion-skeleton) linear infinite;

  @keyframes skeletonShift {
    to {
      background-position: -200% 0;
    }
  }
`

export const Skeleton = styled.div<{ $height?: string }>`
  ${shimmer}
  width: 100%;
  height: ${(p) => p.$height ?? 'var(--ig-icon-md)'};
  border-radius: var(--ig-radius-sm);
`
