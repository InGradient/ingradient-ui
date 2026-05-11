import styled, { keyframes, css } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: 0 0; }
  100% { background-position: 32px 0; }
`

const activeStripes = css`
  background-image:
    linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%),
    repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18) 0 8px,
      rgba(255, 255, 255, 0) 8px 16px
    );
  background-blend-mode: normal;
  background-size: 100% 100%, 32px 100%;
  animation: ${shimmer} 1s linear infinite;
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-progress-track);
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $value: number; $active: boolean }>`
  width: ${(p) => `${Math.max(0, Math.min(100, p.$value))}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  transition: width 0.25s ease;
  ${(p) => p.$active && activeStripes}
`

export function ProgressBar({ value }: { value: number }) {
  const active = value > 0 && value < 100
  return (
    <ProgressTrack>
      <ProgressFill $value={value} $active={active} />
    </ProgressTrack>
  )
}
