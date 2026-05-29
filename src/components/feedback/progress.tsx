import styled, { keyframes, css } from 'styled-components'

const STRIPE_PERIOD_PX = 20
const ANGLE_DEG = 120
const ANGLE_RAD = (ANGLE_DEG * Math.PI) / 180

/**
 * Horizontal-only shift 가 gradient 축 (ANGLE_DEG 방향) 으로 정확히 한 주기
 * 만큼 투영되도록 X 길이를 계산. y 시프트는 0 — 무늬는 대각선이지만 흐름은
 * 좌→우 직선.
 */
const SHIFT_X = STRIPE_PERIOD_PX / Math.sin(ANGLE_RAD)

const shimmer = keyframes`
  from { background-position: 0 0; }
  to   { background-position: ${SHIFT_X.toFixed(3)}px 0; }
`

const activeOverlay = css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    /**
     * Continuous wave (peak ↔ baseline) — fully-transparent gap 이 없으므로
     * 어느 위치도 "shimmer 가 비어 보이는" 구간이 없음.
     */
    background-image: repeating-linear-gradient(
      ${ANGLE_DEG}deg,
      var(--ig-color-white-06) 0,
      var(--ig-color-white-24) ${STRIPE_PERIOD_PX / 2}px,
      var(--ig-color-white-06) ${STRIPE_PERIOD_PX}px
    );
    animation: ${shimmer} var(--ig-motion-shimmer) linear infinite;
  }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: var(--ig-space-3);
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
  transition: width var(--ig-motion-normal);
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
