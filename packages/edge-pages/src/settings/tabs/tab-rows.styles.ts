// 설정 탭들이 공유하는 행 구조. 탭마다 같은 결로 보이려면 한 곳에서 와야 한다.
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

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

export const Hint = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
`
