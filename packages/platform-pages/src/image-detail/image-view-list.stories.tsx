import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageViewList, type ImageViewListItem } from './image-view-list'

const VIEWS: ImageViewListItem[] = [
  { id: 'v1', name: 'Original' },
  { id: 'v2', name: 'View A' },
  { id: 'v3', name: 'View B' },
]

const CANVAS_STYLE = { position: 'relative' as const, height: '100vh', background: 'var(--ig-color-surface-canvas)' }

const meta: Meta<typeof ImageViewList> = {
  id: 'platform-pages-imagedetail-imageviewlist',
  title: 'Components/Platform/ImageDetail/ImageViewList',
  component: ImageViewList,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={CANVAS_STYLE}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

function InteractiveDemo() {
  const [currentId, setCurrentId] = useState('v1')
  return <ImageViewList views={VIEWS} currentId={currentId} onSelect={setCurrentId} />
}

export const Default: Story = { args: { views: VIEWS, currentId: 'v1', onSelect: () => undefined } }
export const Interactive: Story = { render: () => <InteractiveDemo /> }
export const NoViews: Story = { args: { views: [], onSelect: () => undefined } }
