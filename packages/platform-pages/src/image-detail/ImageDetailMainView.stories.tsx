import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ImageDetailMainView } from './ImageDetailMainView'
import type { ImageDetailMainViewProps, ImageDetailTool } from './image-detail-main.types'

const FRAME_STYLE = { position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, height: '100vh', background: 'var(--ig-color-bg-canvas)' }
const SLOT_STYLE = { position: 'absolute' as const, top: 'var(--ig-spacing-12)', left: 'var(--ig-spacing-12)', color: 'var(--ig-color-text-muted)' }
const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#5b6472"/><circle cx="320" cy="240" r="120" fill="#8a94a6"/></svg>')}`
const OBJECTS = [
  { id: 'bbox-0', type: 'rect' as const, x: 0.3, y: 0.3, w: 0.25, h: 0.3, color: 'var(--ig-color-danger)', label: 'Scratch' },
  { id: 'point-0', type: 'point' as const, x: 0.7, y: 0.6, color: 'var(--ig-color-accent)', label: 'Dent' },
]
const GROUP_ITEMS = [
  { id: '0', name: 'part_01.png', pattern_label: 'solid' },
  { id: '1', name: 'part_02.png', pattern_label: 'x_phase_0_of_4' },
  { id: '2', name: 'part_03.png', pattern_label: 'x_phase_1_of_4' },
]
const noop = () => undefined
const MOUSE_HANDLERS = { onMouseDown: noop, onMouseMove: noop, onMouseUp: noop, onMouseLeave: noop }

type DemoProps = Pick<ImageDetailMainViewProps, 'loading' | 'hiResLoading' | 'archived' | 'onClose'> & {
  tools: ImageDetailTool[]
  withGroup?: boolean
  withViewSwitcher?: boolean
  withMobileInfo?: boolean
  onSelectTool: (tool: ImageDetailTool) => void
  onDelete: () => void
}

/** Holds the state the app would own, so the story exercises the controlled contract. */
function MainDemo({ tools, withGroup, withViewSwitcher, withMobileInfo, onSelectTool, onDelete, ...rest }: DemoProps) {
  const [zoom, setZoom] = useState(1)
  const [mode, setMode] = useState<ImageDetailTool>('cursor')
  const [groupId, setGroupId] = useState('0')
  const [infoOpen, setInfoOpen] = useState(false)
  return (
    <div style={FRAME_STYLE}>
      <ImageDetailMainView
        {...rest}
        canvas={{
          imageUrl: IMAGE_URL, alt: 'part_01.png', imageAspect: 640 / 480, zoom, pan: { x: 0, y: 0 },
          objects: OBJECTS, selectedId: 'bbox-0', showHandles: mode === 'cursor', showLabels: true,
          mouseHandlers: MOUSE_HANDLERS, cursor: mode === 'cursor' ? 'default' : 'crosshair',
        }}
        onZoomIn={() => setZoom((value) => value + 0.5)}
        onZoomOut={() => setZoom((value) => Math.max(1, value - 0.5))}
        coordText="x 0.412, y 0.388"
        toolbar={{
          mode, tools,
          onSelectTool: (tool) => { setMode(tool); onSelectTool(tool) },
          canUndo: true, canRedo: false, canReset: true, onUndo: noop, onRedo: noop, onReset: noop, onDelete,
        }}
        mobileInfo={withMobileInfo ? { active: infoOpen, onToggle: () => setInfoOpen((value) => !value) } : undefined}
        group={withGroup ? { items: GROUP_ITEMS, currentId: groupId, onSelect: setGroupId } : undefined}
        viewSwitcherSlot={withViewSwitcher ? <div style={SLOT_STYLE}>View switcher slot</div> : undefined}
      />
    </div>
  )
}

const meta: Meta<typeof MainDemo> = {
  id: 'platform-pages-image-detail-imagedetailmainview',
  title: 'Components/Platform/Image Detail/ImageDetailMainView',
  component: MainDemo,
  parameters: { layout: 'fullscreen' },
  args: {
    tools: ['cursor', 'bbox', 'point', 'classification'],
    onClose: fn().mockName('onClose'),
    onSelectTool: fn().mockName('onSelectTool'),
    onDelete: fn().mockName('onDelete'),
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
/** A detection task: the app passes only the tools that task allows. */
export const DetectionTools: Story = { args: { tools: ['cursor', 'bbox'] } }
export const Loading: Story = { args: { loading: true } }
export const HiResLoading: Story = { args: { hiResLoading: true } }
export const Archived: Story = { args: { archived: true } }
export const WithViewSwitcherSlot: Story = { args: { withViewSwitcher: true } }
export const GroupTabs: Story = {
  args: { withGroup: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const second = canvas.getByRole('tab', { name: 'X 1/4' })
    await userEvent.click(second)
    await expect(second).toHaveAttribute('aria-selected', 'true')
  },
}
export const ToolAndZoomWorkflow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Zoom out' })).toBeDisabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }))
    await expect(canvas.getByRole('button', { name: 'Zoom out' })).toBeEnabled()
    await userEvent.click(within(canvas.getByRole('toolbar', { name: 'Image detail toolbar' })).getByRole('button', { name: 'Draw bbox' }))
    await expect(args.onSelectTool).toHaveBeenCalledWith('bbox')
    await userEvent.click(canvas.getByRole('button', { name: 'Delete image' }))
    await expect(args.onDelete).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }))
    await expect(args.onClose).toHaveBeenCalled()
  },
}
/** At the mobile breakpoint the top-right buttons gain the one that opens the side panel drawer. */
export const MobileInfoButton: Story = {
  args: { withMobileInfo: true },
  globals: { viewport: { value: 'mobile1' } },
}
