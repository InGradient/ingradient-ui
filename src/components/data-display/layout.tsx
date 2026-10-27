import styled from 'styled-components'
import { surfacePanel, withSurfaceDepth } from '../../primitives'

const SectionPanelBase = styled.section`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  padding: var(--ig-space-8);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-6);
`

export const SectionPanel = withSurfaceDepth(SectionPanelBase, { displayName: 'SectionPanel' })

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  flex-wrap: wrap;
`
