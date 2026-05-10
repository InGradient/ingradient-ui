import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../feedback/badge'
import { InfoRow, InfoRowLabel, InfoRowValue } from './info-row'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/InfoRow',
  component: InfoRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof InfoRow>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Info Row"
      description="2-column key-value readout. Used for image metadata, NIC diagnostics, and similar info displays. Domain content (badges, status) is composed inside the value slot."
    >
      <StorybookSection title="Variants" description="Single-row examples covering text, badge, long text, and multi-line values.">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Plain text" subtitle="single label + single value">
            <InfoRow>
              <InfoRowLabel>File</InfoRowLabel>
              <InfoRowValue>capture-001.png</InfoRowValue>
            </InfoRow>
          </StorybookCard>
          <StorybookCard title="With badge" subtitle="value can mix text + Badge">
            <InfoRow>
              <InfoRowLabel>Jumbo Frame</InfoRowLabel>
              <InfoRowValue>
                9014 bytes <Badge $tone="success">OK</Badge>
              </InfoRowValue>
            </InfoRow>
          </StorybookCard>
          <StorybookCard title="Long value (wrap)" subtitle="value flex-wraps and stays inside container">
            <InfoRow>
              <InfoRowLabel>Path</InfoRowLabel>
              <InfoRowValue>/var/lib/ingradient/captures/2026-05-09/sequence-1234/frame-005-with-very-long-name.png</InfoRowValue>
            </InfoRow>
          </StorybookCard>
          <StorybookCard title="Empty value" subtitle="placeholder text for missing data">
            <InfoRow>
              <InfoRowLabel>Captured</InfoRowLabel>
              <InfoRowValue style={{ color: 'var(--ig-color-text-muted)' }}>—</InfoRowValue>
            </InfoRow>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Stack" description="Multiple InfoRow items stacked. Caller controls outer container.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Image metadata example" subtitle="6 rows in a single panel">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)' }}>
              <InfoRow>
                <InfoRowLabel>File</InfoRowLabel>
                <InfoRowValue>capture-001.png</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>Uploaded</InfoRowLabel>
                <InfoRowValue>2026-05-09 14:32</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>Captured</InfoRowLabel>
                <InfoRowValue>2026-05-08 09:15</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>Camera</InfoRowLabel>
                <InfoRowValue>Crevis CB-200CS · 192.168.80.10</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>Dimensions</InfoRowLabel>
                <InfoRowValue>2048 × 1536</InfoRowValue>
              </InfoRow>
              <InfoRow>
                <InfoRowLabel>Quality</InfoRowLabel>
                <InfoRowValue>
                  High (q95) <Badge $tone="neutral">JPG</Badge>
                </InfoRowValue>
              </InfoRow>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
