import { DropdownSelect, Stack, Switch } from '@ingradient/ui'
import { ApertureIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { SettingsRow } from '@ingradient/ui/patterns'

import type { CaptureTabOption, CaptureTabViewProps } from '../types'
import { Hint, SectionLabel, TabTitle, TabWrap } from './tab-shell'

/** 고른 값에 붙는 설명. 선택지마다 다른 문장이 붙는다. */
function hintOf(options: CaptureTabOption[], value: string): string | undefined {
  return options.find((o) => o.value === value)?.hint
}

export function CaptureTabView(props: CaptureTabViewProps): JSX.Element {
  const {
    aiEnabled, aiPattern, patternOptions, aiFallback, fallbackOptions,
    isCapturing, labels,
    onToggleAi, onChangePattern, onChangeFallback,
  } = props

  return (
    <TabWrap>
      <TabTitle>
        <ApertureIcon size={iconSizeNumbers.xs} />
        {labels.title}
      </TabTitle>

      <SettingsRow
        divider={false}
        label={labels.aiModeLabel}
        description={labels.aiModeDesc}
        control={(
          <Switch
            checked={aiEnabled}
            disabled={isCapturing}
            onChange={(e) => onToggleAi(e.target.checked)}
          />
        )}
      />
      {!aiEnabled && <Hint>{labels.classicHint}</Hint>}

      {aiEnabled && (
        <>
          <SectionLabel>{labels.aiSection}</SectionLabel>

          <Stack gap="var(--ig-space-2)">
            <Hint>{labels.aiPattern}</Hint>
            <DropdownSelect
              value={aiPattern}
              options={patternOptions.map((o) => ({ value: o.value, label: o.label }))}
              disabled={isCapturing}
              aria-label={labels.aiPattern}
              onChange={onChangePattern}
            />
            <Hint>{labels.aiPatternHint}</Hint>
          </Stack>

          <Stack gap="var(--ig-space-2)">
            <Hint>{labels.aiFallback}</Hint>
            <DropdownSelect
              value={aiFallback}
              options={fallbackOptions.map((o) => ({ value: o.value, label: o.label }))}
              disabled={isCapturing}
              aria-label={labels.aiFallback}
              onChange={onChangeFallback}
            />
            {/* 고른 값에 따라 설명이 달라진다 — 자동 전환인지 중단인지가 현장에서 갈린다. */}
            {hintOf(fallbackOptions, aiFallback) && <Hint>{hintOf(fallbackOptions, aiFallback)}</Hint>}
          </Stack>
        </>
      )}

      {isCapturing && <Hint>{labels.capturingHint}</Hint>}
    </TabWrap>
  )
}
