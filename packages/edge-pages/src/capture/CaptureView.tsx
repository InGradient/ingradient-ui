import { useEffect, useRef, useState } from 'react'
import { Grid, Maximize2, Minimize2, SlidersHorizontal } from 'lucide-react'
import { Switch, useZoomPan } from '@ingradient/ui'
import {
  ConnectingSpinner, PreviewArea, CaptureZoomWrap, SetupMetrics, MetricCard, MetricLabel, MetricValue,
  SetupBlockingOverlay, SetupBlockingCard, PlaceholderText, OverlayControls, OverlayHeader,
  OverlayPopover, ControlRow, ControlLabel,
  CaptureBar, CaptureButtonWrap, CaptureButton, StatusText,
  GridOverlay, CenterCrosshair, ConnectingBox, ConnectingSpinnerBox, StreamImg,
  FocusPeakingOverlay, HistogramOverlay, HistogramImage,
  AbsolutePlaceholder, CapturingBadge,
  CapturePreviewFullscreenBtn,
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
            <MetricCard><MetricLabel>{labels.brightness}</MetricLabel><MetricValue>{setupMetrics?.brightness ?? 'N/A'}</MetricValue></MetricCard>
            <MetricCard><MetricLabel>{labels.contrast}</MetricLabel><MetricValue>{setupMetrics?.contrast ?? 'N/A'}</MetricValue></MetricCard>
            <MetricCard><MetricLabel>{labels.focus}</MetricLabel><MetricValue>{setupMetrics?.focus_score ?? 'N/A'}</MetricValue></MetricCard>
            <MetricCard><MetricLabel>{labels.overPct}</MetricLabel><MetricValue>{setupMetrics?.overexposed_pct ?? 'N/A'}</MetricValue></MetricCard>
            <MetricCard><MetricLabel>{labels.underPct}</MetricLabel><MetricValue>{setupMetrics?.underexposed_pct ?? 'N/A'}</MetricValue></MetricCard>
          </SetupMetrics>
        )}

        {isConnected ? (
          <>
            {!hasReceivedSnapshot && (
              <ConnectingBox>
                {isAutoReconnecting ? (
                  <>
                    <ConnectingSpinner size={32} />
                    <PlaceholderText>{labels.cameraReconnecting}</PlaceholderText>
                  </>
                ) : snapshotError ? (
                  <>
                    <PlaceholderText>{snapshotError}</PlaceholderText>
                    {onReconnect && (
                      <button type="button" onClick={onReconnect} style={{ marginTop: 8 }}>
                        {labels.reconnectStream}
                      </button>
                    )}
                  </>
                ) : (
                  <PlaceholderText>{labels.waitingFrames}</PlaceholderText>
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
          <ConnectingSpinnerBox>
            <ConnectingSpinner size={32} />
            <PlaceholderText>{labels.connecting}</PlaceholderText>
          </ConnectingSpinnerBox>
        ) : (
          <PlaceholderText>{labels.noCamera}</PlaceholderText>
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
          <CapturePreviewFullscreenBtn
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </CapturePreviewFullscreenBtn>
        )}
        <OverlayControls>
          <OverlayHeader onClick={onToggleControls} title={labels.controls}>
            <SlidersHorizontal size={18} />
          </OverlayHeader>
          {showControls && (
            <OverlayPopover>
              <ControlRow>
                <ControlLabel><Grid size={14} /> {labels.grid}</ControlLabel>
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
