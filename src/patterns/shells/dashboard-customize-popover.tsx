import styled from 'styled-components'
import { Stack, Text } from '../../primitives'
import { MenuPopover } from '../../components/overlays/popovers'
import { Checkbox } from '../../components/inputs/toggles'

const Wrap = styled(MenuPopover)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: min(320px, calc(100vw - 32px));
  padding: var(--ig-space-6);
  border-radius: var(--ig-radius-lg);
`

const TITLE_STYLE = { marginBottom: 'var(--ig-space-4)' }

export interface DashboardCustomizeItem {
  key: string
  label: string
}

export interface DashboardCustomizePopoverProps<K extends string = string> {
  items: DashboardCustomizeItem[]
  visibility: Record<K, boolean>
  onToggle: (key: K, checked: boolean) => void
  title?: string
  className?: string
}

export function DashboardCustomizePopover<K extends string = string>({
  items, visibility, onToggle,
  title = 'Visible Sections',
  className,
}: DashboardCustomizePopoverProps<K>) {
  return (
    <Wrap className={className} role="menu">
      <Text size="12px" weight={700} tone="soft" uppercase letterSpacing="0.05em" style={TITLE_STYLE}>{title}</Text>
      <Stack gap={3}>
        {items.map((item) => (
          <Checkbox
            key={item.key}
            label={item.label}
            checked={!!visibility[item.key as K]}
            onChange={(e) => onToggle(item.key as K, e.target.checked)}
          />
        ))}
      </Stack>
    </Wrap>
  )
}
