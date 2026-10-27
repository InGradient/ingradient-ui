import styled from 'styled-components'
import { SectionPanel } from '@ingradient/ui/components'

/** Card for dashboard analysis blocks and widgets. Its radius follows surface depth. */
export const DashboardCard = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  padding: var(--ig-spacing-16) var(--ig-spacing-20);
  gap: var(--ig-spacing-12);
`
