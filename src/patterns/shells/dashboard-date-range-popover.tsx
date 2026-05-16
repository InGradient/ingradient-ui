import { DayPicker, type DateRange } from 'react-day-picker'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { MenuPopover } from '../../components/overlays/popovers'
import { SmallText } from '../../components/feedback/status'

const Popover = styled(MenuPopover)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 24;
  width: min(360px, calc(100vw - 40px));
  padding: 16px;
  border-radius: 20px;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
`

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const Subtitle = styled.div`
  font-size: 12px;
  color: var(--ig-color-text-soft);
`

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`

const PresetButton = styled(Button).attrs({ variant: 'secondary', size: 'sm' as const })`
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
`

const Calendar = styled.div`
  padding: 12px;
  border-radius: 18px;
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
  .rdp-day { width: 38px; height: 38px; border-radius: 12px; font-size: 13px; color: var(--ig-color-text-secondary); }
  .rdp-day_button { width: 100%; height: 100%; border-radius: 12px; }
  .rdp-selected .rdp-day_button, .rdp-day_button:hover {
    background: var(--ig-color-blue-tint-16);
    color: var(--ig-color-text-primary);
  }
  .rdp-range_middle .rdp-day_button {
    background: rgba(77, 136, 255, 0.1);
    color: var(--ig-color-text-primary);
  }
  .rdp-range_start .rdp-day_button, .rdp-range_end .rdp-day_button {
    background: var(--ig-color-accent);
    color: white;
  }
`

const Summary = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: var(--ig-color-text-soft);
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
`

const FooterActions = styled.div`
  display: flex;
  gap: 8px;
`

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
      <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Header>
      <PresetRow>
        <PresetButton type="button" onClick={() => onSelectPreset('today')}>Today</PresetButton>
        <PresetButton type="button" onClick={() => onSelectPreset('last7')}>Last 7 days</PresetButton>
        <PresetButton type="button" onClick={() => onSelectPreset('thisMonth')}>This month</PresetButton>
      </PresetRow>
      <Calendar>
        <DayPicker mode="range" selected={dateDraft} onSelect={onChangeDraft} numberOfMonths={1} showOutsideDays />
      </Calendar>
      <Summary>{summaryLabel}</Summary>
      <Footer>
        <SmallText>{footerHint}</SmallText>
        <FooterActions>
          <PresetButton type="button" onClick={onReset}>Reset</PresetButton>
          <Button variant="secondary" type="button" onClick={onApply}>Apply</Button>
        </FooterActions>
      </Footer>
    </Popover>
  )
}
