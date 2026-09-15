// Experiments 탭 전용. 공통 행 구조는 tab-rows 에서 온다.
import styled from 'styled-components'

export const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

/** 주기 행의 상태 문구(중복·기준). 값이 없어도 자리를 차지해 행이 흔들리지 않는다. */
export const PeriodNote = styled.span`
  flex: 1;
  min-width: 0;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
`

export const TotalBox = styled.div`
  padding: var(--ig-space-3) var(--ig-space-4);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-xs);
`
