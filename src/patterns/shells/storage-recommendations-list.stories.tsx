import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorageRecommendationsList } from './storage-recommendations-list'

const recommendations = [
  { tone: 'info' as const, text: 'Preview tier saves 88% of Detail view egress vs serving lossless originals.' },
  { tone: 'info' as const, text: '8,294 images (≤1024px) skip preview generation — appropriate, files are small.' },
  { tone: 'warn' as const, text: '"Wafer line A" accounts for 42% of total storage (203.4 GB) — consider archiving old data.' },
  { tone: 'warn' as const, text: 'BMP uploads at 12% — consider client-side WebP conversion to reduce upload time.' },
]

const meta: Meta<typeof StorageRecommendationsList> = {
  title: 'Patterns/Shells/StorageRecommendationsList',
  component: StorageRecommendationsList,
  decorators: [(Story) => <div style={{ width: 720, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Mixed: Story = { args: { recommendations } }
export const OnlyInfo: Story = { args: { recommendations: recommendations.filter((r) => r.tone === 'info') } }
export const OnlyWarn: Story = { args: { recommendations: recommendations.filter((r) => r.tone === 'warn') } }
export const Empty: Story = { args: { recommendations: [] } }
export const Loading: Story = { args: { recommendations: [], loading: true } }
