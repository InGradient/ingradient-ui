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

// 진행률 불명(작업 중) 일 때 좌→우로 흐르는 marquee.
const marquee = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
`

const TONE_FILL = {
  accent: 'linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%)',
  danger: 'var(--ig-color-danger)',
  success: 'var(--ig-color-success)',
} as const

export type ProgressTone = keyof typeof TONE_FILL

export const ProgressTrack = styled.div`
  width: 100%;
  height: var(--ig-space-3);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-progress-track);
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $value: number; $active: boolean; $indeterminate: boolean; $tone: ProgressTone }>`
  position: relative;
  width: ${(p) => (p.$indeterminate ? '30%' : `${Math.max(0, Math.min(100, p.$value))}%`)};
  height: 100%;
  border-radius: inherit;
  background: ${(p) => TONE_FILL[p.$tone]};
  transition: width var(--ig-motion-normal);
  overflow: hidden;
  ${(p) =>
    p.$indeterminate
      ? css`animation: ${marquee} var(--ig-motion-progress-bar) linear infinite;`
      : p.$active && activeOverlay}
`

export interface ProgressBarProps {
  /** 0–100 진행률. indeterminate 면 무시. */
  value?: number
  /** 진행률 불명 — marquee 애니메이션. */
  indeterminate?: boolean
  /** fill 색 — 기본 accent, 실패 danger, 완료 success. */
  tone?: ProgressTone
}

export function ProgressBar({ value = 0, indeterminate = false, tone = 'accent' }: ProgressBarProps) {
  const active = !indeterminate && value > 0 && value < 100
  return (
    <ProgressTrack
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(Math.max(0, Math.min(100, value)))}
    >
      <ProgressFill $value={value} $active={active} $indeterminate={indeterminate} $tone={tone} />
    </ProgressTrack>
  )
}
