import styled, { keyframes, css } from 'styled-components'

const STRIPE_PERIOD_PX = 16

const shimmer = keyframes`
  from { background-position: 0 0; }
  to   { background-position: ${STRIPE_PERIOD_PX}px 0; }
`

const activeOverlay = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.22) 0 ${STRIPE_PERIOD_PX / 2}px,
      rgba(255, 255, 255, 0) ${STRIPE_PERIOD_PX / 2}px ${STRIPE_PERIOD_PX}px
    );
    animation: ${shimmer} 0.9s linear infinite;
  }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-progress-track);
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $value: number; $active: boolean }>`
  position: relative;
  width: ${(p) => `${Math.max(0, Math.min(100, p.$value))}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  transition: width 0.25s ease;
  overflow: hidden;
  ${(p) => p.$active && activeOverlay}
`

export function ProgressBar({ value }: { value: number }) {
  const active = value > 0 && value < 100
  return (
    <ProgressTrack>
      <ProgressFill $value={value} $active={active} />
    </ProgressTrack>
  )
}
