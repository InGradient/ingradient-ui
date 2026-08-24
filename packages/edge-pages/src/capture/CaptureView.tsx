import { controlSizeNumbers } from '@ingradient/ui'
import { useEffect, useRef, useState } from 'react'
import { GridLinesIcon, ExpandIcon, CollapseIcon, SlidersIcon, Button, IconButton, Card } from '@ingradient/ui/components'
import { Switch, useZoomPan, iconSizeNumbers } from '@ingradient/ui'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import {
  ConnectingSpinner, PreviewArea, CaptureZoomWrap, SetupMetrics, MetricLabel, MetricValue,
  SetupBlockingOverlay, SetupBlockingCard, OverlayControls,
  OverlayPopover, ControlRow,
  CaptureBar, CaptureButtonWrap, CaptureButton, StatusText,
  GridOverlay, CenterCrosshair, ConnectingBox, StreamImg,
  FocusPeakingOverlay, HistogramOverlay, HistogramImage,
  CapturingBadge,
} from './CaptureView.styles'
import { useFullscreen } from './use-fullscreen'
import { patternLabelToUI } from './pattern-helpers'
import { FOCUS_PEAKING_PATTERN } from './types'
import type { CaptureViewProps } from './types'

export function CaptureView(props: CaptureViewProps): JSX.Element {
  const {
    isConnected, isConnecting, isCapturing, isSetupMode, isSetupBusy, isSavingSequence,
    liveFrameSrc, previewSrc, frozenFrameSrc, hasReceivedSnapshot, snapshotError,
    progressText, captureStep, captureTotalSteps,
    setupMetrics, previewPatternLabel, setupPatternLabel,
    captureDisabledReason, captureStatusHint,
    showGrid, showControls, labels,
    onCapture, onReconnect, onToggleGrid, onToggleControls,
  } = props

  const previewAreaRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen<HTMLDivElement>(previewAreaRef)
  const { zoom, pan, reset: resetZoom, handleWheel, startPan, movePan, endPan, isZoomPanning } = useZoomPan({ minZoom: 1, maxZoom: 8 })
  const [isAutoReconnecting] = useState(false)

  useEffect(() => {
    const el = previewAreaRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  useEffect(() => { resetZoom() }, [isSetupMode, resetZoom])

  const canPan = zoom > 1
  const cursor = isZoomPanning() ? 'grabbing' : canPan ? 'grab' : 'default'
  const captureStepText = captureStep != null && captureTotalSteps
    ? `${labels.captureStepText} ${captureStep + 1}/${captureTotalSteps}`
    : (progressText && progressText !== labels.ready ? progressText : labels.captureStepText)

  return (
    <>
      <PreviewArea
        ref={previewAreaRef}
        style={{ cursor }}
        onMouseDown={(e) => { if (canPan) { e.preventDefault(); startPan(e.clientX, e.clientY, pan.x, pan.y) } }}
        onMouseMove={(e) => movePan(e.clientX, e.clientY)}
        onMouseUp={() => endPan()}
        onMouseLeave={() => endPan()}
      >
        {showGrid && <GridOverlay />}
        {showGrid && <CenterCrosshair />}
        {isSetupMode && (
          <SetupMetrics>
            <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-3) var(--ig-space-4)"><MetricLabel>{labels.brightness}</MetricLabel><MetricValue>{setupMetrics?.brightness ?? 'N/A'}</MetricValue></Card>
            <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-3) var(--ig-space-4)"><MetricLabel>{labels.contrast}</MetricLabel><MetricValue>{setupMetrics?.contrast ?? 'N/A'}</MetricValue></Card>
            <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-3) var(--ig-space-4)"><MetricLabel>{labels.focus}</MetricLabel><MetricValue>{setupMetrics?.focus_score ?? 'N/A'}</MetricValue></Card>
            <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-3) var(--ig-space-4)"><MetricLabel>{labels.overPct}</MetricLabel><MetricValue>{setupMetrics?.overexposed_pct ?? 'N/A'}</MetricValue></Card>
            <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-3) var(--ig-space-4)"><MetricLabel>{labels.underPct}</MetricLabel><MetricValue>{setupMetrics?.underexposed_pct ?? 'N/A'}</MetricValue></Card>
          </SetupMetrics>
        )}

        {isConnected ? (
          <>
            {!hasReceivedSnapshot && (
              <ConnectingBox>
                {isAutoReconnecting ? (
                  <>
                    <ConnectingSpinner size={controlSizeNumbers.sm} />
                    <Text as="div" tone="soft" size="var(--ig-font-size-4xl)">{labels.cameraReconnecting}</Text>
                  </>
                ) : snapshotError ? (
                  <>
                    <Text as="div" tone="soft" size="var(--ig-font-size-4xl)">{snapshotError}</Text>
                    {onReconnect && (
                      <Button type="button" variant="secondary" size="sm" onClick={onReconnect} style={{ marginTop: 'var(--ig-space-3)' }}>
                        {labels.reconnectStream}
                      </Button>
                    )}
                  </>
                ) : (
                  <Text as="div" tone="soft" size="var(--ig-font-size-4xl)">{labels.waitingFrames}</Text>
                )}
              </ConnectingBox>
            )}
            <CaptureZoomWrap $zoom={zoom} $panX={pan.x} $panY={pan.y}>
              {previewSrc
                ? <StreamImg src={previewSrc} alt={labels.liveStream} draggable={false} />
                : ((isCapturing && frozenFrameSrc) || liveFrameSrc
                  ? <StreamImg src={isCapturing && frozenFrameSrc ? frozenFrameSrc : (liveFrameSrc ?? '')} alt={labels.liveStream} draggable={false} />
                  : null)}
              {isSetupMode && previewPatternLabel === FOCUS_PEAKING_PATTERN && setupMetrics?.focus_peaking_overlay_data_url && (
                <FocusPeakingOverlay src={setupMetrics.focus_peaking_overlay_data_url} alt="Focus peaking overlay" />
              )}
            </CaptureZoomWrap>
            {isCapturing && !previewSrc && frozenFrameSrc && (
              <CapturingBadge>{captureStepText}</CapturingBadge>
            )}
          </>
        ) : isConnecting ? (
          <Stack align="center" gap="var(--ig-space-5)">
            <ConnectingSpinner size={controlSizeNumbers.sm} />
            <Text as="div" tone="soft" size="var(--ig-font-size-4xl)">{labels.connecting}</Text>
          </Stack>
        ) : (
          <Text as="div" tone="soft" size="var(--ig-font-size-4xl)">{labels.noCamera}</Text>
        )}

        {isSetupMode && setupMetrics?.histogram_data_url && (
          <HistogramOverlay><HistogramImage src={setupMetrics.histogram_data_url} alt="Histogram" /></HistogramOverlay>
        )}
        {isSetupMode && isSetupBusy && (
          <SetupBlockingOverlay>
            <SetupBlockingCard><ConnectingSpinner size="md" />{progressText}</SetupBlockingCard>
          </SetupBlockingOverlay>
        )}
        {!isSetupMode && (
          <IconButton
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
            aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
            style={{ position: 'absolute', top: 'var(--ig-space-4)', right: 'var(--ig-control-height-3xl)', zIndex: 'var(--ig-z-capture-high)' }}
          >
            {isFullscreen ? <CollapseIcon size={iconSizeNumbers.lg} /> : <ExpandIcon size={iconSizeNumbers.lg} />}
          </IconButton>
        )}
        <OverlayControls>
          <IconButton variant="secondary" size="sm" onClick={onToggleControls} title={labels.controls} aria-label={labels.controls}>
            <SlidersIcon size={iconSizeNumbers.lg} />
          </IconButton>
          {showControls && (
            <OverlayPopover>
              <ControlRow>
                <Inline as="span" align="center" gap="var(--ig-space-2)" wrap="nowrap"><GridLinesIcon size={iconSizeNumbers.sm} /> {labels.grid}</Inline>
                <Switch checked={showGrid} onChange={(e) => { void e; onToggleGrid() }} />
              </ControlRow>
            </OverlayPopover>
          )}
        </OverlayControls>
      </PreviewArea>

      <CaptureBar>
        <StatusText>
          {isSetupMode
            ? progressText
            : (captureDisabledReason ?? (isCapturing ? captureStepText : (captureStatusHint ?? labels.ready)))}
        </StatusText>
        <CaptureButtonWrap>
          {!isSetupMode && (
            <CaptureButton
              onClick={isCapturing || isConnecting || captureDisabledReason ? undefined : onCapture}
              $capturing={isCapturing}
              disabled={isCapturing || isConnecting || !!captureDisabledReason}
              data-capturing={isCapturing || undefined}
              title={captureDisabledReason ?? (isSavingSequence ? labels.savingPreviousCapture : undefined)}
            />
          )}
        </CaptureButtonWrap>
        {isSetupMode && (
          <StatusText>
            {setupPatternLabel
              ? patternLabelToUI(setupPatternLabel)
              : (previewPatternLabel ? patternLabelToUI(previewPatternLabel) : labels.noPattern)}
          </StatusText>
        )}
      </CaptureBar>
    </>
  )
}
