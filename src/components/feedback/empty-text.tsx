import styled from 'styled-components'
import { stateTitleText, stateCenteredLayout } from '../../primitives'

/**
 * 섹션/패널 안의 "항목 없음" 같은 가벼운 빈-상태 텍스트.
 * 아이콘·제목·설명·액션을 갖춘 블록형 EmptyState 와 달리, stateTitleText + 중앙정렬만.
 * org-members / invitations / org-settings / dashboard-overview 가 각자 styled.p 로
 * 재정의하던 동일 패턴을 승격.
 */
export const EmptyText = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`
