import type { ReactNode } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import styled from 'styled-components'
import { Inline, Stack, Text } from '../../primitives'
import { Button } from './button'
import { MenuPopover } from '../overlays/popovers'
import { SmallText } from '../feedback/status'

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

export type DateRangePickerValue = Date | DateRange | undefined

export interface DateRangePickerPreset {
  id: string
  label: string
  resolve: () => DateRangePickerValue
}

export interface DateRangePickerProps {
  /** 'single' = 단일 날짜 선택, 'range' = 범위 선택 (시작/끝 두 클릭). */
  mode: 'single' | 'range'
  value: DateRangePickerValue
  onChange: (next: DateRangePickerValue) => void
  /** Preset 버튼 (Today / Last 7 days / This month 등). 없으면 미렌더. */
  presets?: DateRangePickerPreset[]
  /** Apply 버튼 onClick. 없으면 Apply 버튼 미렌더. */
  onApply?: () => void
  /** Reset 버튼 onClick. 없으면 Reset 버튼 미렌더. */
  onReset?: () => void
  /** Popover 헤더 제목. */
  title?: ReactNode
  /** Popover 헤더 부제. */
  subtitle?: ReactNode
  /** Calendar 아래 현재 선택 요약 (예: "Apr 1 — Apr 7"). */
  summaryLabel?: ReactNode
  /** Footer 안내 (예: "Saved per user"). */
  footerHint?: ReactNode
  className?: string
}

/**
 * Date / Date-range picker with preset buttons + Apply / Reset footer.
 * MenuPopover surface 안에 calendar + presets + summary + footer 를 배치.
 * Calendar 는 `react-day-picker` 의 DayPicker (단일/범위 모드).
 *
 * Caller 가 외부에서 conditional render 로 visibility 제어 (popover 가 항상 보이는
 * 위치에 absolute 로 배치되므로). 단일 input 형태가 필요하면 DatePickerField 사용.
 */
export function DateRangePicker({
  mode,
  value,
  onChange,
  presets,
  onApply,
  onReset,
  title,
  subtitle,
  summaryLabel,
  footerHint,
  className,
}: DateRangePickerProps) {
  return (
    <Popover className={className} role="dialog" aria-label={typeof title === 'string' ? title : undefined}>
      {(title || subtitle) ? (
        <Stack gap={2} style={HEADER_STYLE}>
          {title ? <Text size="13px" weight={700}>{title}</Text> : null}
          {subtitle ? <Text size="12px" tone="soft">{subtitle}</Text> : null}
        </Stack>
      ) : null}
      {presets && presets.length > 0 ? (
        <Inline gap={3} wrap="wrap" style={PRESET_ROW_STYLE}>
          {presets.map((p) => (
            <Button
              key={p.id}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onChange(p.resolve())}
              style={PRESET_BTN_STYLE}
            >
              {p.label}
            </Button>
          ))}
        </Inline>
      ) : null}
      <Calendar>
        {mode === 'range' ? (
          <DayPicker
            mode="range"
            selected={value as DateRange | undefined}
            onSelect={(next) => onChange(next)}
            numberOfMonths={1}
            showOutsideDays
          />
        ) : (
          <DayPicker
            mode="single"
            selected={value as Date | undefined}
            onSelect={(next) => onChange(next)}
            numberOfMonths={1}
            showOutsideDays
          />
        )}
      </Calendar>
      {summaryLabel ? <Text size="12px" tone="soft" style={SUMMARY_STYLE}>{summaryLabel}</Text> : null}
      {(footerHint || onApply || onReset) ? (
        <Inline justify="space-between" gap={4} style={FOOTER_STYLE}>
          {footerHint ? <SmallText>{footerHint}</SmallText> : <span />}
          <Inline gap={3}>
            {onReset ? (
              <Button type="button" variant="secondary" size="sm" onClick={onReset} style={PRESET_BTN_STYLE}>
                Reset
              </Button>
            ) : null}
            {onApply ? (
              <Button variant="secondary" type="button" onClick={onApply}>
                Apply
              </Button>
            ) : null}
          </Inline>
        </Inline>
      ) : null}
    </Popover>
  )
}
