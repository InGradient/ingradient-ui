import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { Stack } from '../layout/flex'
import { SvgBboxRect } from './svg-bbox-rect'
import { SvgPointDot } from './svg-point-dot'
import { SvgShapeHandle } from './svg-shape-handle'
import { SvgShapeLabel } from './svg-shape-label'

const meta = {
  title: 'Primitives/Svg',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const Page = styled.div`
  padding: var(--ig-space-8);
  background: var(--ig-color-bg-canvas);
`

const Card = styled.div`
  padding: var(--ig-space-6);
  border-radius: var(--ig-radius-xl);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-panel);
`

const Caption = styled.p`
  margin: 0;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
`

export const Review: Story = {
  render: () => (
    <Page>
      <Stack gap={16}>
        <Card>
          <Stack gap={12}>
            <Caption>Annotation-oriented SVG primitives previewed together in the same coordinate space.</Caption>
            <svg
              viewBox="0 0 640 360"
              role="img"
              aria-label="SVG primitive preview"
              style={{
                width: '100%',
                maxWidth: 960,
                borderRadius: 'var(--ig-radius-lg)',
                background: 'linear-gradient(135deg, #162131 0%, #24344d 100%)',
              }}
            >
              <SvgBboxRect
                x={120}
                y={72}
                w={220}
                h={150}
                color="#6eb3ff"
                fillOpacity={0.16}
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
              />
              <SvgShapeHandle cx={120} cy={72} rx={6} color="#6eb3ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <SvgShapeHandle cx={340} cy={72} rx={6} color="#6eb3ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <SvgShapeHandle cx={120} cy={222} rx={6} color="#6eb3ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <SvgShapeHandle cx={340} cy={222} rx={6} color="#6eb3ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <SvgShapeLabel
                width={128}
                height={24}
                color="#0f62d6"
                text="class: tomato"
                fontSize={12}
                transform="translate(120 68)"
              />
              <SvgPointDot
                cx={450}
                cy={130}
                rx={8}
                color="#ff8f6b"
                stroke="#ffffff"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <SvgPointDot
                cx={500}
                cy={200}
                rx={9}
                ry={6}
                color="#ffd84d"
                stroke="#18212f"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </Stack>
        </Card>
      </Stack>
    </Page>
  ),
}
