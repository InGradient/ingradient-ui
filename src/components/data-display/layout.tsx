import styled from 'styled-components'
import { surfacePanel } from '../../primitives'

export const SectionPanel = styled.section`
  ${surfacePanel}
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`
