import styled from 'styled-components'

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-progress-track);
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $value: number }>`
  width: ${(p) => `${Math.max(0, Math.min(100, p.$value))}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
`

export function ProgressBar({ value }: { value: number }) {
  return (
    <ProgressTrack>
      <ProgressFill $value={value} />
    </ProgressTrack>
  )
}
