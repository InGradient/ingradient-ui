import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { Stack } from '../layout/flex'
import { SvgBboxRect } from './svg-bbox-rect'
import { SvgPointDot } from './svg-point-dot'
import { SvgShapeHandle } from './svg-shape-handle'
import { SvgShapeLabel } from './svg-shape-label'

const meta = {
  title: 'Primitives/SVG',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function AnnotationCanvas({ children, label }: { children: ReactNode; label: string }) {
  return <svg viewBox="0 0 640 360" role="img" aria-label={label} style={{ width: '100%', maxWidth: 960, border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-lg)', background: 'var(--ig-color-surface-header)' }}>{children}</svg>
}

export const Overview: Story = {
  render: () => (
    <StorybookPage title="Annotation SVG primitives" description="These primitives own SVG geometry only. Colors use theme tokens so the same examples remain meaningful in light and dark mode.">
      <StorybookSection title="Combined annotation" description="Bounding boxes, resize handles, labels, and point annotations share one coordinate space.">
        <Stack gap="var(--ig-space-4)"><AnnotationCanvas label="Combined annotation primitive preview">
          <SvgBboxRect x={120} y={72} w={220} h={150} color="var(--ig-color-accent)" fillOpacity={0.16} strokeWidth={3} vectorEffect="non-scaling-stroke" />
          <SvgShapeHandle cx={120} cy={72} rx={6} color="var(--ig-color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeHandle cx={340} cy={72} rx={6} color="var(--ig-color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeHandle cx={120} cy={222} rx={6} color="var(--ig-color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeHandle cx={340} cy={222} rx={6} color="var(--ig-color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeLabel width={128} height={24} color="var(--ig-color-accent-strong)" text="class: tomato" fontSize={12} transform="translate(120 68)" />
          <SvgPointDot cx={450} cy={130} rx={8} color="var(--ig-color-alert-danger-text)" stroke="var(--ig-color-on-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgPointDot cx={500} cy={200} rx={9} ry={6} color="var(--ig-color-alert-warning-text)" stroke="var(--ig-color-text-primary)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </AnnotationCanvas></Stack>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const ShapeVariants: Story = {
  name: 'Shape variants',
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => (
    <StorybookPage title="SVG shape variants" description="Review circle/ellipse points, transparent box fill, and label geometry at small canvas widths.">
      <StorybookSection title="Point and box variants" description="The left point is a circle; the right point is an ellipse. The box intentionally uses fillOpacity=0.">
        <AnnotationCanvas label="SVG primitive shape variants">
          <SvgBboxRect x={64} y={72} w={240} h={160} color="var(--ig-color-accent)" fillOpacity={0} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeLabel width={148} height={24} color="var(--ig-color-surface-active)" text="transparent bounding box" fontSize={12} transform="translate(64 68)" />
          <SvgPointDot cx={390} cy={130} rx={10} color="var(--ig-color-status-running-text)" stroke="var(--ig-color-on-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgPointDot cx={500} cy={130} rx={14} ry={8} color="var(--ig-color-alert-warning-text)" stroke="var(--ig-color-text-primary)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <SvgShapeHandle cx={64} cy={232} rx={7} ry={4} color="var(--ig-color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </AnnotationCanvas>
      </StorybookSection>
    </StorybookPage>
  ),
}
