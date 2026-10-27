import styled from 'styled-components'
import { SectionPanel } from '@ingradient/ui/components'

/** Card for dashboard analysis blocks and widgets. Its radius follows surface depth. */
export const DashboardCard = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  padding: var(--ig-space-7) var(--ig-space-9);
  gap: var(--ig-space-5);
`
