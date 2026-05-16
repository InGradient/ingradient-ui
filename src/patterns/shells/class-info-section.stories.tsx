import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassInfoSection } from './class-info-section'

const meta: Meta<typeof ClassInfoSection> = {
  title: 'Patterns/Shells/ClassInfoSection',
  component: ClassInfoSection,
  decorators: [(Story) => <div style={{ width: 268, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'Name', children: <span style={{ color: 'var(--ig-color-text-primary)' }}>Crack</span> },
}

export const WithParagraph: Story = {
  args: {
    title: 'Description',
    children: <p style={{ margin: 0, color: 'var(--ig-color-text-secondary)', fontSize: 13 }}>Surface micro-crack defect, typically straight or branching.</p>,
  },
}
