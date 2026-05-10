import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnnotationOverlay, type AnnotationOverlayBbox, type AnnotationOverlayPoint } from './annotation-overlay'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/AnnotationOverlay',
  component: AnnotationOverlay,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof AnnotationOverlay>

export default meta

type Story = StoryObj<typeof meta>

const classColors: Record<string, string> = {
  dent: '#ff7f66',
  scratch: '#6fb6ff',
  glare: '#7ce0be',
}
const getColor = (id: string) => classColors[id]

const sampleBboxes: AnnotationOverlayBbox[] = [
  { classId: 'dent', x: 0.18, y: 0.22, w: 0.22, h: 0.18 },
  { classId: 'scratch', x: 0.52, y: 0.58, w: 0.16, h: 0.12 },
]

const samplePoints: AnnotationOverlayPoint[] = [
  { classId: 'glare', x: 0.71, y: 0.32 },
  { classId: 'glare', x: 0.38, y: 0.74 },
]

function svgThumb(label: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#g)" />
      <text x="20" y="320" font-family="sans-serif" font-size="22" fill="white">${label}</text>
    </svg>
  `)}`
}

function ThumbFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 12,
        overflow: 'hidden',
        background: `center / cover no-repeat url("${svgThumb(label, '#112f57', '#1d7568')}")`,
      }}
    >
      {children}
    </div>
  )
}

export const Review: Story = {
  args: { getColor, imageWidth: 640, imageHeight: 360 },
  render: () => (
    <StorybookPage
      title="AnnotationOverlay"
      description="Bbox + point overlay drawn over a thumbnail image. SVG-based with object-fit: cover viewBox correction. Use `emphasize` for catalog-style readable outlines, `fillOpacity` for tinted bboxes, `selectedClassId` to filter."
    >
      <StorybookSection title="Variants" description="emphasize / fillOpacity / point support side by side.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Stroke-only (default)" subtitle="edge labeling style — fillOpacity=0, emphasize=false">
            <ThumbFrame label="Stroke">
              <AnnotationOverlay bboxes={sampleBboxes} getColor={getColor} imageWidth={640} imageHeight={360} />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Tinted fill" subtitle="fillOpacity=0.22">
            <ThumbFrame label="Tinted">
              <AnnotationOverlay
                bboxes={sampleBboxes}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                fillOpacity={0.22}
              />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Emphasized" subtitle="emphasize=true → double outline + dark shadow">
            <ThumbFrame label="Emphasize">
              <AnnotationOverlay
                bboxes={sampleBboxes}
                points={samplePoints}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                fillOpacity={0.22}
                emphasize
              />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Points only" subtitle="bbox 미사용 케이스">
            <ThumbFrame label="Points">
              <AnnotationOverlay
                points={samplePoints}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                emphasize
              />
            </ThumbFrame>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="selectedClassId filter" description="Show only annotations matching the selected class.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="All classes" subtitle="selectedClassId omitted">
            <ThumbFrame label="All">
              <AnnotationOverlay
                bboxes={sampleBboxes}
                points={samplePoints}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                fillOpacity={0.22}
                emphasize
              />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Filter: dent" subtitle='selectedClassId="dent"'>
            <ThumbFrame label="Dent only">
              <AnnotationOverlay
                bboxes={sampleBboxes}
                points={samplePoints}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                fillOpacity={0.22}
                emphasize
                selectedClassId="dent"
              />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Filter: glare (point only)" subtitle='selectedClassId="glare"'>
            <ThumbFrame label="Glare only">
              <AnnotationOverlay
                bboxes={sampleBboxes}
                points={samplePoints}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                emphasize
                selectedClassId="glare"
              />
            </ThumbFrame>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="object-fit: cover boundary" description="Landscape vs portrait thumbnails — bboxes anchor to the cropped square region, not the full image.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Landscape source (640×360)" subtitle="cropped to square — horizontal slice">
            <ThumbFrame label="Landscape">
              <AnnotationOverlay
                bboxes={[{ classId: 'dent', x: 0.05, y: 0.05, w: 0.9, h: 0.9 }]}
                getColor={getColor}
                imageWidth={640}
                imageHeight={360}
                emphasize
              />
            </ThumbFrame>
          </StorybookCard>
          <StorybookCard title="Portrait source (360×640)" subtitle="cropped to square — vertical slice">
            <ThumbFrame label="Portrait">
              <AnnotationOverlay
                bboxes={[{ classId: 'dent', x: 0.05, y: 0.05, w: 0.9, h: 0.9 }]}
                getColor={getColor}
                imageWidth={360}
                imageHeight={640}
                emphasize
              />
            </ThumbFrame>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
