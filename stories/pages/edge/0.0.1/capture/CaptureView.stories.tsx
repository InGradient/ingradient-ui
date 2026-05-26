import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  CaptureView,
  type CaptureLabels,
  type DeflectometryMetrics,
} from '@ingradient/edge-pages'

const LABELS: CaptureLabels = {
  ready: 'Ready',
  controls: 'Controls',
  grid: 'Grid',
  capture: 'Capture',
  liveStream: 'Live stream',
  noPattern: 'No pattern',
  cameraReconnecting: 'Reconnecting camera…',
  reconnectStream: 'Reconnect stream',
  waitingFrames: 'Waiting for frames…',
  loadingStream: 'Loading stream…',
  connecting: 'Connecting camera…',
  noCamera: 'No camera connected',
  exitFullscreen: 'Exit fullscreen',
  enterFullscreen: 'Enter fullscreen',
  savingPreviousCapture: 'Saving previous capture…',
  brightness: 'Brightness',
  contrast: 'Contrast',
  focus: 'Focus',
  overPct: 'Over %',
  underPct: 'Under %',
  captureStepText: 'Capturing',
}

const SAMPLE_METRICS: DeflectometryMetrics = {
  has_camera: true,
  fps: 30,
  exposure: 50000,
  gain: 300,
  brightness: 128,
  contrast: 64,
  focus_score: 0.82,
  overexposed_pct: 2.5,
  underexposed_pct: 5.1,
}

function CaptureViewScene(args: {
  isConnected?: boolean
  isConnecting?: boolean
  isCapturing?: boolean
  isSetupMode?: boolean
  isSetupBusy?: boolean
  hasReceivedSnapshot?: boolean
  snapshotError?: string | null
  liveFrameSrc?: string | null
  captureDisabledReason?: string | null
}) {
  const [showGrid, setShowGrid] = useState(false)
  const [showControls, setShowControls] = useState(false)
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ig-color-bg-canvas)' }}>
      <CaptureView
        isConnected={args.isConnected ?? true}
        isConnecting={args.isConnecting ?? false}
        isCapturing={args.isCapturing ?? false}
        isSetupMode={args.isSetupMode ?? false}
        isSetupBusy={args.isSetupBusy ?? false}
        isSavingSequence={false}
        liveFrameSrc={args.liveFrameSrc ?? null}
        previewSrc={null}
        frozenFrameSrc={null}
        hasReceivedSnapshot={args.hasReceivedSnapshot ?? true}
        snapshotError={args.snapshotError ?? null}
        progressText="Ready"
        captureStep={null}
        captureTotalSteps={null}
        setupMetrics={args.isSetupMode ? SAMPLE_METRICS : null}
        previewPatternLabel={null}
        setupPatternLabel={null}
        captureDisabledReason={args.captureDisabledReason ?? null}
        captureStatusHint={null}
        showGrid={showGrid}
        showControls={showControls}
        labels={LABELS}
        onCapture={() => undefined}
        onReconnect={() => undefined}
        onToggleGrid={() => setShowGrid((v) => !v)}
        onToggleControls={() => setShowControls((v) => !v)}
      />
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Capture/CaptureView',
  component: CaptureViewScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CaptureViewScene>

export default meta

type Story = StoryObj<typeof meta>

export const Disconnected: Story = { args: { isConnected: false } }
export const Connecting: Story = { args: { isConnected: false, isConnecting: true } }
export const WaitingFrames: Story = { args: { isConnected: true, hasReceivedSnapshot: false } }
export const Capturing: Story = { args: { isConnected: true, isCapturing: true } }
export const SetupMode: Story = { args: { isConnected: true, isSetupMode: true } }
export const SetupBusy: Story = { args: { isConnected: true, isSetupMode: true, isSetupBusy: true } }
export const CaptureDisabled: Story = {
  args: { isConnected: true, captureDisabledReason: 'Insert dataset to capture' },
}
