import styled, { keyframes, css } from 'styled-components'

/**
 * Stripe 한 쌍 (light + transparent) 의 두께. 작을수록 촘촘.
 * 24px = 12 light + 12 gap.
 */
const STRIPE_PERIOD_PX = 24

/**
 * 대각선 135deg 방향으로 한 주기 만큼 shift 하기 위한 (x, y) 길이.
 * 135deg direction = (√2/2, √2/2), 따라서 (period/√2, period/√2) 만큼
 * 이동하면 정확히 한 period 만큼 진행해 seamless loop.
 */
const DIAG_SHIFT_PX = STRIPE_PERIOD_PX / Math.SQRT2

const shimmer = keyframes`
  from { background-position: 0 0; }
  to   { background-position: ${DIAG_SHIFT_PX}px ${DIAG_SHIFT_PX}px; }
`

const activeOverlay = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.20) 0 ${STRIPE_PERIOD_PX / 2}px,
      rgba(255, 255, 255, 0) ${STRIPE_PERIOD_PX / 2}px ${STRIPE_PERIOD_PX}px
    );
    animation: ${shimmer} 1.2s linear infinite;
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
