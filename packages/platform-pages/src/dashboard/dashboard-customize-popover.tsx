import styled from 'styled-components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { MenuPopover } from '@ingradient/ui/components'
import { Checkbox } from '@ingradient/ui/components'

const Wrap = styled(MenuPopover)`
  position: absolute;
  top: calc(100% + var(--ig-spacing-8));
  right: 0;
  z-index: var(--ig-z-sticky-plus);
  width: min(var(--ig-popup-md), calc(100vw - var(--ig-spacing-32)));
  padding: var(--ig-spacing-12);
  border-radius: var(--ig-radius-lg);
`

const TITLE_STYLE = { marginBottom: 'var(--ig-spacing-8)' }

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
    <Wrap className={className} role="group" aria-label={title}>
      <Text size="var(--ig-text-caption)" weight="bold" tone="soft" uppercase letterSpacing="wide" style={TITLE_STYLE}>{title}</Text>
      <Stack gap="var(--ig-spacing-8)">
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
