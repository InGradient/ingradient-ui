import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisLabelingByPersonWidget } from './analysis-labeling-by-person-widget'

const meta: Meta<typeof AnalysisLabelingByPersonWidget> = {
  title: 'Platform Pages/Dashboard Widgets/AnalysisLabelingByPersonWidget',
  component: AnalysisLabelingByPersonWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisLabelingByPersonWidget>

const BY_PERSON = [
  { uploader: 'June Lee', image_count: 412, labeled_count: 380 },
  { uploader: 'Soyeon Park', image_count: 318, labeled_count: 290 },
  { uploader: 'Daniel Kim', image_count: 247, labeled_count: 200 },
  { uploader: 'Mira Choi', image_count: 165, labeled_count: 140 },
]

export const Default: Story = {
  args: {
    byPerson: BY_PERSON,
    chartData: BY_PERSON.map((p) => ({
      name: p.uploader.split(' ')[0],
      fullName: p.uploader,
      images: p.image_count,
      labeled: p.labeled_count,
    })),
  },
}

export const Empty: Story = { args: { byPerson: [], chartData: [] } }
