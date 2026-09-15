import styled from 'styled-components'

export const TabWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const TabTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
`

/** 왼쪽에 설명, 오른쪽에 컨트롤 하나가 붙는 행. */
export const RowBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
`

export const RowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

export const RowPrimary = styled.span`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
`

export const RowSecondary = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
`

export const SectionLabel = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-micro);
`

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

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

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

export const Hint = styled.span`
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
