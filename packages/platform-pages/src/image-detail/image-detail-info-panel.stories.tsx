import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ImageDetailInfoPanel, type ImageDetailInfoPanelProps } from './image-detail-info-panel'

function Demo(props: Omit<ImageDetailInfoPanelProps, 'detailsOpen' | 'onToggleDetails'>) {
  const [open, setOpen] = useState(false)
  return <ImageDetailInfoPanel {...props} detailsOpen={open} onToggleDetails={() => setOpen(!open)} />
}

const meta = {
  title: 'Platform Pages/Image Detail/ImageDetailInfoPanel',
  component: Demo,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 320, background: 'var(--ig-color-bg-canvas)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

const BASE_IMAGE = {
  name: 'wafer-batch-007.jpg',
  created_at: '2024-12-15 14:32',
  captured_at: '2024-12-15 14:30',
  uploader: 'jhlee',
  dimensions: { width: 4096, height: 3072 },
  size_bytes: 2_543_120,
  sequence_id: 'seq-A-001',
  sequence_step: 2,
  pattern_label: 'x_phase_2_of_5',
}

export const BasicOnly: Story = { args: { image: BASE_IMAGE } }

export const InGroup: Story = {
  args: { image: BASE_IMAGE, positionLabel: 'Image 3 of 5' },
}

export const Detailed: Story = {
  args: {
    image: {
      ...BASE_IMAGE,
      upload_source: 'Edge',
      camera_ip: '192.168.10.42',
      camera_type: 'Basler',
      camera_model: 'acA2440-75um',
      edge_device: 'edge-line-A',
      labeled_by: 'spark@ingradient.ai',
      labeled_at: '2024-12-16 09:11',
      upload_quality: 'high',
      package_version: 3,
      capture_duration_ms: 84,
    },
  },
}

export const Minimal: Story = {
  args: { image: { name: 'minimal.jpg' } },
}
