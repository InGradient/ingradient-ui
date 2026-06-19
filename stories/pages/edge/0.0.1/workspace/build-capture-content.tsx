// Capture 탭 content — 실시간 스트림 + 캡처 컨트롤.
import { useState } from 'react'
import { CaptureView, type CaptureLabels } from '@ingradient/edge-pages'

const CAPTURE_LABELS: CaptureLabels = {
  ready: 'Ready', controls: 'Controls', grid: 'Grid', capture: 'Capture',
  liveStream: 'Live stream', noPattern: 'No pattern',
  cameraReconnecting: 'Reconnecting camera…', reconnectStream: 'Reconnect stream',
  waitingFrames: 'Waiting for frames…', loadingStream: 'Loading stream…',
  connecting: 'Connecting camera…', noCamera: 'No camera connected',
  exitFullscreen: 'Exit fullscreen', enterFullscreen: 'Enter fullscreen',
  savingPreviousCapture: 'Saving previous capture…',
  brightness: 'Brightness', contrast: 'Contrast', focus: 'Focus',
  overPct: 'Over %', underPct: 'Under %', captureStepText: 'Capturing',
}

export function CaptureContent({
  isCapturing = false,
  isSetupMode = false,
}: { isCapturing?: boolean; isSetupMode?: boolean }): JSX.Element {
  const [showGrid, setShowGrid] = useState(false)
  const [showControls, setShowControls] = useState(false)
  return (
    <CaptureView
      isConnected
      isConnecting={false}
      isCapturing={isCapturing}
      isSetupMode={isSetupMode}
      isSetupBusy={false}
      isSavingSequence={false}
      liveFrameSrc={null}
      previewSrc={null}
      frozenFrameSrc={null}
      hasReceivedSnapshot
      snapshotError={null}
      progressText={isCapturing ? 'Capturing 3 / 6' : 'Ready'}
      captureStep={isCapturing ? 3 : null}
      captureTotalSteps={isCapturing ? 6 : null}
      setupMetrics={null}
      previewPatternLabel={null}
      setupPatternLabel={null}
      captureDisabledReason={null}
      captureStatusHint={null}
      showGrid={showGrid}
      showControls={showControls}
      labels={CAPTURE_LABELS}
      onCapture={() => undefined}
      onReconnect={() => undefined}
      onToggleGrid={() => setShowGrid((v) => !v)}
      onToggleControls={() => setShowControls((v) => !v)}
    />
  )
}
