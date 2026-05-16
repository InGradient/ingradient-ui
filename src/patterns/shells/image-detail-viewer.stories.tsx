import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageDetailViewer } from './image-detail-viewer'
import { AnnotationViewer } from './annotation-viewer'
import { CommentsPanel } from './comments-panel'
import { ImageClassTags } from './image-class-tags'
import sample1 from '../../../stories/assets/20230808.jpg'

const meta: Meta<typeof ImageDetailViewer> = {
  title: 'Patterns/ImageDetailViewer',
  component: ImageDetailViewer,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ padding: 24, maxWidth: 1080 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const baseImage = {
  id: 'img-1',
  name: '20230808-wafer-001.jpg',
  sync_state: 'synced' as const,
  width: 4096,
  height: 3072,
  size_bytes: 3_245_678,
  uploader: 'jhlee',
  created_at: '2024-12-12 09:24',
  dataset_name: 'Wafer line A',
  sequence_label: 'seq-1 · step 0',
  pattern_label: 'A',
}

export const WithAnnotations: Story = {
  args: {
    image: baseImage,
    annotationViewer: <AnnotationViewer imageUrl={sample1 as string} boxes={[
      { id: 'b1', label: 'Crack', color: '#ff6b6b', x: 0.12, y: 0.18, width: 0.32, height: 0.24 },
      { id: 'b2', label: 'Scratch', color: '#feca57', x: 0.55, y: 0.42, width: 0.28, height: 0.18 },
    ]} />,
    classTagsSlot: <ImageClassTags tags={[
      { id: 'cl-1', name: 'Crack', color: '#ff6b6b' },
      { id: 'cl-2', name: 'Scratch', color: '#feca57' },
    ]} />,
  },
}

export const WithCommentsAndAnnotations: Story = {
  args: {
    image: baseImage,
    annotationViewer: <AnnotationViewer imageUrl={sample1 as string} boxes={[
      { id: 'b1', label: 'Crack', color: '#ff6b6b', x: 0.18, y: 0.30, width: 0.22, height: 0.20 },
    ]} />,
    classTagsSlot: <ImageClassTags tags={[
      { id: 'cl-1', name: 'Crack', color: '#ff6b6b' },
    ]} />,
    commentsSlot: <CommentsPanel
      comments={[
        { id: 'c1', authorName: 'June Lee', authorInitials: 'JL', body: 'Suspected crack on top-left edge.', createdAt: '2 hours ago' },
        { id: 'c2', authorName: 'Soyeon Park', authorInitials: 'SP', body: 'Confirmed.', createdAt: '1 hour ago' },
      ]}
      onReply={() => undefined}
    />,
  },
}
