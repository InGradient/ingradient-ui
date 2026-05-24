import styled from 'styled-components'
import { MenuPopover } from '../../components/overlays/popovers'

const Wrap = styled(MenuPopover)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: min(320px, calc(100vw - 32px));
  padding: var(--ig-space-6);
  border-radius: var(--ig-radius-lg);
`

const Title = styled.div`
  margin-bottom: var(--ig-space-4);
  font-size: 12px;
  font-weight: 700;
  color: var(--ig-color-text-soft);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const Row = styled.label`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  font-size: 13px;
  color: var(--ig-color-text-primary);
  cursor: pointer;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  accent-color: var(--ig-color-accent);
  cursor: pointer;
`

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
      <Title>{title}</Title>
      <List>
        {items.map((item) => (
          <Row key={item.key}>
            <Checkbox
              checked={!!visibility[item.key as K]}
              onChange={(e) => onToggle(item.key as K, e.target.checked)}
            />
            <span>{item.label}</span>
          </Row>
        ))}
      </List>
    </Wrap>
  )
}
