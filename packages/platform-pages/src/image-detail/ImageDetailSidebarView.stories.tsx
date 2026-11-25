import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ImageDetailSidebarView, type ImageDetailSidebarViewProps } from './ImageDetailSidebarView'

const FRAME_STYLE = { position: 'relative' as const, width: 'var(--ig-popup-md)', height: '100vh', background: 'var(--ig-color-surface-panel)' }

const CLASSES = [
  { id: 'c1', name: 'Scratch', color: 'var(--ig-color-danger)' },
  { id: 'c2', name: 'Dent', color: 'var(--ig-color-accent)' },
  { id: 'c3', name: 'Stain', color: 'var(--ig-color-success)' },
]
const LABELERS = [
  { id: 'alex@example.com', label: 'Alex Kim', tooltip: 'alex@example.com' },
  { id: 'sam@example.com', label: 'Sam Lee', tooltip: 'sam@example.com' },
]
const CAMERA_ROWS = [
  { label: 'Exposure', value: '12000 µs' },
  { label: 'Gain', value: '4' },
  { label: 'Frame Rate', value: '30 fps' },
]
const COMMENTS = [
  { id: 'm1', authorName: 'Alex Kim', authorInitials: 'AK', body: 'This box looks too wide on the left edge.', createdAt: '2 hours ago' },
]

type DemoProps = {
  withCameraParams?: boolean
  withLabelers?: boolean
  classification?: boolean
  mobileVisible?: boolean
  onSelectClass: (id: string) => void
  onCloseMobile: () => void
}

/** Holds the state the app would own, so the story exercises the controlled contract. */
function SidebarDemo({ withCameraParams, withLabelers, classification, mobileVisible, onSelectClass, onCloseMobile }: DemoProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState(() => new Set(LABELERS.map((user) => user.id)))
  const props: ImageDetailSidebarViewProps = {
    info: {
      image: { name: 'image_0412.png', created_at: 'Today, 10:24', captured_at: 'Today, 10:20', dimensions: { width: 2448, height: 2048 }, size_bytes: 1843200, uploader: 'Alex Kim' },
      positionLabel: withCameraParams ? 'Image 2 of 5' : undefined,
      detailsOpen,
      onToggleDetails: () => setDetailsOpen((value) => !value),
      cameraParams: withCameraParams ? { rows: CAMERA_ROWS, open: cameraOpen, onToggle: () => setCameraOpen((value) => !value) } : undefined,
    },
    classes: {
      items: CLASSES,
      selectedClassId: classification ? null : selectedClassId,
      classifiedClassIds: classification ? ['c1', 'c3'] : undefined,
      onSelectClass: (id) => {
        setSelectedClassId((prev) => (prev === id ? null : id))
        onSelectClass(id)
      },
    },
    comments: { comments: COMMENTS, onReply: () => undefined },
    labelers: withLabelers
      ? {
          users: LABELERS,
          selectedIds: selectedUsers,
          onToggle: (id) => setSelectedUsers((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
          }),
        }
      : undefined,
    mobile: mobileVisible === undefined ? undefined : { visible: mobileVisible, onClose: onCloseMobile },
  }
  return <div style={FRAME_STYLE}><ImageDetailSidebarView {...props} /></div>
}

const meta: Meta<typeof SidebarDemo> = {
  id: 'platform-pages-image-detail-imagedetailsidebarview',
  title: 'Components/Platform/Image Detail/ImageDetailSidebarView',
  component: SidebarDemo,
  parameters: { layout: 'fullscreen' },
  args: { withLabelers: true, onSelectClass: fn().mockName('onSelectClass'), onCloseMobile: fn().mockName('onCloseMobile') },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithCameraParameters: Story = {
  args: { withCameraParams: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Camera Parameters' }))
    await expect(canvas.getByText('12000 µs')).toBeInTheDocument()
  },
}
export const ClassificationMode: Story = { args: { classification: true } }
export const WithoutLabelers: Story = { args: { withLabelers: false } }
export const SelectClassWorkflow: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Dent'))
    await expect(args.onSelectClass).toHaveBeenCalledWith('c2')
  },
}
