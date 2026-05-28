import type { Meta, StoryObj } from '@storybook/react-vite'
import { Camera, Info } from 'lucide-react'
import styled from 'styled-components'
import { Inline, Stack } from '../layout/flex'
import { Divider, Icon, ScrollArea } from './misc'
import { Surface } from './surface'

const meta = {
  title: 'Primitives/Surfaces',
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

const Label = styled.div`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const Item = styled.div`
  padding: var(--ig-space-3) 0;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
`

export const Review: Story = {
  render: () => (
    <Page>
      <Stack gap={24}>
        <Inline gap={16} align="stretch">
          <Surface elevation="panel" radius="var(--ig-radius-xl)" style={{ flex: 1, padding: 'var(--ig-space-6)' }}>
            <Stack gap={12}>
              <Label>Panel</Label>
              <div style={{ color: 'var(--ig-color-text-primary)', fontWeight: 600 }}>Default shell background</div>
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                Use for sidebars, settings sections, and neutral content containers.
              </div>
            </Stack>
          </Surface>

          <Surface elevation="raised" radius="var(--ig-radius-xl)" style={{ flex: 1, padding: 'var(--ig-space-6)' }}>
            <Stack gap={12}>
              <Label>Raised</Label>
              <div style={{ color: 'var(--ig-color-text-primary)', fontWeight: 600 }}>Higher emphasis surface</div>
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                Good for cards, hover states, and elevated control groupings.
              </div>
            </Stack>
          </Surface>

          <Surface elevation="card" radius="var(--ig-radius-xl)" style={{ flex: 1, padding: 'var(--ig-space-6)' }}>
            <Stack gap={12}>
              <Label>Card</Label>
              <div style={{ color: 'var(--ig-color-text-primary)', fontWeight: 600 }}>Dense card treatment</div>
              <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                Tight visual bundle with border and surface treatment already applied.
              </div>
            </Stack>
          </Surface>
        </Inline>

        <Surface elevation="panel" radius="var(--ig-radius-xl)" style={{ padding: 'var(--ig-space-6)' }}>
          <Stack gap={16}>
            <Label>Misc primitives</Label>
            <Inline gap={12} align="center">
              <Icon size={18}>
                <Camera />
              </Icon>
              <div style={{ color: 'var(--ig-color-text-primary)', fontWeight: 600 }}>Icon wrapper keeps SVG sizing consistent.</div>
            </Inline>
            <Divider />
            <ScrollArea
              style={{
                maxHeight: 180,
                paddingRight: 'var(--ig-space-2)',
              }}
            >
              <Stack gap={0}>
                {[
                  'Dataset summary and review notes',
                  'Annotation sync status',
                  'Upload queue details',
                  'Quality checks and validation hints',
                  'Secondary metadata fields',
                  'Long overflow content for scroll behavior',
                ].map((item) => (
                  <Item key={item}>
                    <Inline gap={10} align="center">
                      <Icon size={16}>
                        <Info />
                      </Icon>
                      <span>{item}</span>
                    </Inline>
                  </Item>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Surface>
      </Stack>
    </Page>
  ),
}
