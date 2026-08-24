import { Button, Checkbox, SelectField, Spinner, iconSizeNumbers } from '@ingradient/ui'
import { Divider, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { CollapsibleSectionHeader, AlertTriangleIcon, Alert, Card } from '@ingradient/ui/components'
import {
  Wrap, Label, Slider, SliderInline, MetricRow,
  QualityHeader, QualityStatus, IndicatorRight,
} from './DeflectometryTuningControlsView.styles'
import { COLORMAP_OPTIONS, type ColormapName } from './colormap-helpers'
import type { DeflectometryTuningControlsViewProps } from './types'

function formatPct(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—'
  return `${(v * 100).toFixed(0)}%`
}

export function DeflectometryTuningControlsView(props: DeflectometryTuningControlsViewProps): JSX.Element {
  const {
    disabled, expanded, activeDerivedKind,
    modulationThreshold, modulationOverlayEnabled, colormaps,
    isRecomputing, isAutoTuning, isSavingDefault, metrics,
    labels,
    onToggleExpanded, onModulationThresholdChange, onModulationOverlayChange, onColormapChange,
    onRecompute, onSaveDefault, onReset,
  } = props
  const isGradient = activeDerivedKind === 'gradient'

  return (
    <Wrap>
      <CollapsibleSectionHeader title={labels.title} open={expanded} onClick={onToggleExpanded} />

      {expanded && (
        <>
          {isGradient && (
            <Stack gap="var(--ig-space-1)">
              <Label>
                <Text tone="muted">modulation threshold</Text>
                <Text tabularNums>{modulationThreshold.toFixed(2)}</Text>
              </Label>
              <SliderInline>
                <Slider
                  min={0.01} max={0.5} step={0.01} value={modulationThreshold}
                  disabled={disabled || !modulationOverlayEnabled}
                  onChange={(e) => onModulationThresholdChange(Number(e.target.value))}
                />
                <Checkbox
                  aria-label={labels.modulationOverlay}
                  label={labels.modulationOverlay}
                  checked={modulationOverlayEnabled}
                  disabled={disabled}
                  onChange={(e) => onModulationOverlayChange(e.target.checked)}
                />
              </SliderInline>
            </Stack>
          )}

          {activeDerivedKind && (
            <Stack gap="var(--ig-space-1)">
              <Label>
                <Text tone="muted">{labels.colormapSection}</Text>
              </Label>
              <SelectField
                value={colormaps[activeDerivedKind]}
                disabled={disabled}
                onChange={(e) => onColormapChange(activeDerivedKind, e.target.value as ColormapName)}
              >
                {COLORMAP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </SelectField>
            </Stack>
          )}
        </>
      )}

      <Button
        variant="accent"
        size="sm"
        disabled={disabled || isRecomputing || isAutoTuning}
        onClick={onRecompute}
      >
        {isRecomputing ? <><Spinner tone="white" size="sm" />{labels.analyzing}</> : labels.analyze}
      </Button>

      <Card elevation="raised" flat radius="var(--ig-radius-xs)" padding="var(--ig-space-3)">
        <Stack gap="var(--ig-space-2)">
          <QualityHeader>
            <Text tone="muted">{labels.confidence}</Text>
            {isRecomputing && !metrics ? (
              <Text tone="muted"><Spinner tone="white" size="sm" />{labels.computing}</Text>
            ) : (
              <IndicatorRight>
                <Text size="var(--ig-font-size-xs)" tone="muted" tabularNums>{formatPct(metrics?.validRatio ?? null)}</Text>
                <QualityStatus $status={metrics?.confidenceStatus ?? null}>
                  {metrics?.confidenceStatus ?? '—'}
                </QualityStatus>
              </IndicatorRight>
            )}
          </QualityHeader>
          <Divider as="div" style={{ margin: 'var(--ig-space-2px) 0' }} />
          <MetricRow>
            <span>{labels.validRatio}</span>
            <span>{formatPct(metrics?.validRatio ?? null)}</span>
          </MetricRow>
          {metrics?.warnings?.includes('low_confidence') && (
            <Alert $tone="warning"><AlertTriangleIcon size={iconSizeNumbers.xs} />{labels.warnLowConfidence}</Alert>
          )}
        </Stack>
      </Card>

      <Inline gap="var(--ig-space-2)" wrap="nowrap">
        <Button variant="secondary" size="sm" disabled={disabled || isSavingDefault} onClick={onSaveDefault}>
          {isSavingDefault && <Spinner tone="white" size="sm" />}
          {isSavingDefault ? labels.saveDefaultSaving : labels.saveDefault}
        </Button>
        <Button variant="secondary" size="sm" disabled={disabled || isRecomputing || isAutoTuning} onClick={onReset}>
          {labels.reset}
        </Button>
      </Inline>
    </Wrap>
  )
}
