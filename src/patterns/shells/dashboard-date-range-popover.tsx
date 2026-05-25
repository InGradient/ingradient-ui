import { DayPicker, type DateRange } from 'react-day-picker'
import styled from 'styled-components'
import { Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { MenuPopover } from '../../components/overlays/popovers'
import { SmallText } from '../../components/feedback/status'

const Popover = styled(MenuPopover)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 24;
  width: min(360px, calc(100vw - 40px));
  padding: var(--ig-space-7);
  border-radius: var(--ig-radius-2xl);
`

const PRESET_BTN_STYLE = {
  padding: 'var(--ig-space-2) var(--ig-space-4)',
  fontSize: 12,
  fontWeight: 600,
}

const Calendar = styled.div`
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-xl);
  background: linear-gradient(180deg, rgba(17, 23, 32, 0.96) 0%, rgba(10, 14, 20, 0.96) 100%);
  border: 1px solid var(--ig-color-white-06);
  .rdp-root {
    --rdp-accent-color: var(--ig-color-accent);
    --rdp-accent-background-color: var(--ig-color-blue-tint-16);
    margin: 0;
    color: var(--ig-color-text-primary);
  }
  .rdp-months { justify-content: center; }
  .rdp-month { width: 100%; }
  .rdp-caption_label {
    font-size: 14px;
    font-weight: 700;
    color: var(--ig-color-text-primary);
  }
  .rdp-day { width: 38px; height: 38px; border-radius: var(--ig-radius-sm); font-size: 13px; color: var(--ig-color-text-secondary); }
  .rdp-day_button { width: 100%; height: 100%; border-radius: var(--ig-radius-sm); }
  .rdp-selected .rdp-day_button, .rdp-day_button:hover {
    background: var(--ig-color-blue-tint-16);
    color: var(--ig-color-text-primary);
  }
  .rdp-range_middle .rdp-day_button {
    background: var(--ig-color-blue-tint-12);
    color: var(--ig-color-text-primary);
  }
  .rdp-range_start .rdp-day_button, .rdp-range_end .rdp-day_button {
    background: var(--ig-color-accent);
    color: var(--ig-color-on-accent);
  }
`

const HEADER_STYLE = { marginBottom: 'var(--ig-space-6)' }
const PRESET_ROW_STYLE = { marginBottom: 'var(--ig-space-6)' }
const SUMMARY_STYLE = { marginTop: 'var(--ig-space-5)' }
const FOOTER_STYLE = { marginTop: 'var(--ig-space-6)' }

export type DateRangePreset = 'today' | 'last7' | 'thisMonth'

export interface DashboardDateRangePopoverProps {
  open: boolean
  dateDraft: DateRange | undefined
  onChangeDraft: (next: DateRange | undefined) => void
  onSelectPreset: (preset: DateRangePreset) => void
  onReset: () => void
  onApply: () => void
  summaryLabel?: string
  title?: string
  subtitle?: string
  footerHint?: string
  className?: string
}

export function DashboardDateRangePopover({
  open, dateDraft, onChangeDraft, onSelectPreset, onReset, onApply,
  summaryLabel = 'All time',
  title = 'Overview Date Range',
  subtitle = 'Filter all Project Overview widgets by created date.',
  footerHint = 'Saved per user and restored on next visit.',
  className,
}: DashboardDateRangePopoverProps) {
  if (!open) return null
  return (
    <Popover className={className} role="dialog" aria-label={title}>
      <Stack gap={2} style={HEADER_STYLE}>
        <Text size="13px" weight={700}>{title}</Text>
        <Text size="12px" tone="soft">{subtitle}</Text>
      </Stack>
      <Inline gap={3} wrap="wrap" style={PRESET_ROW_STYLE}>
        <Button type="button" variant="secondary" size="sm" onClick={() => onSelectPreset('today')} style={PRESET_BTN_STYLE}>Today</Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => onSelectPreset('last7')} style={PRESET_BTN_STYLE}>Last 7 days</Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => onSelectPreset('thisMonth')} style={PRESET_BTN_STYLE}>This month</Button>
      </Inline>
      <Calendar>
        <DayPicker mode="range" selected={dateDraft} onSelect={onChangeDraft} numberOfMonths={1} showOutsideDays />
      </Calendar>
      <Text size="12px" tone="soft" style={SUMMARY_STYLE}>{summaryLabel}</Text>
      <Inline justify="space-between" gap={4} style={FOOTER_STYLE}>
        <SmallText>{footerHint}</SmallText>
        <Inline gap={3}>
          <Button type="button" variant="secondary" size="sm" onClick={onReset} style={PRESET_BTN_STYLE}>Reset</Button>
          <Button variant="secondary" type="button" onClick={onApply}>Apply</Button>
        </Inline>
      </Inline>
    </Popover>
  )
}
