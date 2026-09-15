// General 탭 전용. 공통 행 구조는 tab-rows 에서 온다.
import styled from 'styled-components'

export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-shrink: 0;
`

/** @ingradient/ui 에 슬라이더가 없어 range input 을 쓴다. 색만 토큰으로 맞춘다. */
export const VolumeRange = styled.input`
  width: 140px;
  accent-color: var(--ig-color-accent, currentColor);
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`

/** 폭 고정 — 자릿수가 바뀔 때 슬라이더가 흔들리지 않게. */
export const VolumeValue = styled.span`
  min-width: 38px;
  text-align: right;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
  font-variant-numeric: tabular-nums;
`
