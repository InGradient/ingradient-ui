import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ArchivedImageOverlay,
  CanvasHiResLoadingPill,
  CanvasImageLoadingOverlay,
  CanvasZoomCloseControls,
} from './canvas-overlays'

const meta: Meta = {
  title: 'Patterns/Annotation/CanvasOverlays',
}
export default meta

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: 480,
      height: 320,
      background: '#0f1418',
      backgroundImage:
        'linear-gradient(45deg, #1a2030 25%, transparent 25%), linear-gradient(-45deg, #1a2030 25%, transparent 25%)',
      backgroundSize: '20px 20px',
      borderRadius: 8,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
)

type ZoomStory = StoryObj<typeof CanvasZoomCloseControls>

function ZoomDemo() {
  const [zoom, setZoom] = useState(1)
  return (
    <Wrap>
      <CanvasZoomCloseControls
        zoom={zoom}
        onZoomIn={() => setZoom((z) => z + 0.2)}
        onZoomOut={() => setZoom((z) => Math.max(1, z - 0.2))}
        onClose={() => undefined}
      />
      <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', fontSize: 13 }}>
        zoom: {zoom.toFixed(2)}
      </div>
    </Wrap>
  )
}

export const ZoomCloseControls: ZoomStory = { render: () => <ZoomDemo /> }

export const ImageLoading: StoryObj = {
  render: () => (
    <Wrap>
      <CanvasImageLoadingOverlay />
    </Wrap>
  ),
}

export const HiResLoadingPillStory: StoryObj = {
  name: 'HiResLoadingPill',
  render: () => (
    <Wrap>
      <CanvasHiResLoadingPill />
    </Wrap>
  ),
}

export const ArchivedOverlay: StoryObj = {
  render: () => (
    <Wrap>
      <ArchivedImageOverlay />
    </Wrap>
  ),
}
