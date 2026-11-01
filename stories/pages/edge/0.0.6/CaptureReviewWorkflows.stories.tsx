// Capture review and labeling workflows: review, derived calculation, drawing, ROI and comments.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Branches005, * as B from '../0.0.5/CaptureBranches.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Review Workflows',
  component: Branches005.component,
  args: Branches005.args,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Review Workflows / Review and save',
    fixturesPath: 'stories/pages/edge/0.0.5/workspace/capture-fixtures.ts',
    requiredScenarios: ['review-save', 'derived-retry', 'derived-unavailable', 'labeling-reset', 'canvas-edit', 'collapsed-roi-comment'],
    interactions: ['Synthetic capture review and labeling; no equipment integration'],
  }),
} satisfies Meta<typeof Branches005.component>

export default meta
type Story = StoryObj<typeof Branches005>

export const ReviewSave: Story = { ...B.ReviewSaveWorkflow, name: 'Review and save', play: paced(B.ReviewSaveWorkflow.play) }
export const DerivedRetry: Story = { ...B.DerivedRetryWorkflow, name: 'Derived calculation → retry', play: paced(B.DerivedRetryWorkflow.play) }
export const DerivedUnavailable: Story = { ...B.DerivedUnavailable, name: 'Derived unavailable (start state)' }
export const LabelingReset: Story = { ...B.LabelingResetWorkflow, name: 'Labeling → reset', play: paced(B.LabelingResetWorkflow.play) }
export const CanvasEdit: Story = { ...B.CanvasEditSelectionZoomWorkflow, name: 'Draw, select and zoom', play: paced(B.CanvasEditSelectionZoomWorkflow.play) }
export const CollapsedRoiComment: Story = { ...B.CollapsedRoiCommentWorkflow, name: 'Collapsed panel, ROI and comment', play: paced(B.CollapsedRoiCommentWorkflow.play) }
