// Capture review and labeling states: the screens after a capture, without steps.
import type { Meta, StoryObj } from '@storybook/react-vite'
import Branches005, * as B from '../0.0.5/CaptureBranches.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Capture/Review and Labeling',
  component: Branches005.component,
  args: Branches005.args,
  tags: ['autodocs'],
  parameters: edge006Parameters({
    page: 'Capture',
    referenceStory: 'Pages / Edge / 0.0.6 / Capture / Review and Labeling / Review',
    fixturesPath: 'stories/pages/edge/0.0.5/workspace/capture-fixtures.ts',
    requiredScenarios: ['review', 'labeling', 'labeling-sequence-failed', 'derived-unavailable'],
    interactions: ['Synthetic capture review and labeling; steps: see Capture / Review Workflows'],
  }),
} satisfies Meta<typeof Branches005.component>

export default meta
type Story = StoryObj<typeof Branches005>

/** Captured image waiting for Save or Skip. */
export const Review: Story = { name: 'Review', args: { initialBranch: 'review' } }
/** Labeling canvas with classes on the right. */
export const Labeling: Story = { name: 'Labeling', args: { initialBranch: 'labeling' } }
/** The next sequence failed to start while labeling. */
export const LabelingSequenceFailed: Story = { name: 'Labeling, sequence failed', tags: ['!autodocs'], args: { initialBranch: 'labeling', initialSequenceFailure: true } }
/** Derived calculation is unavailable for this capture. */
export const DerivedUnavailable: Story = { ...B.DerivedUnavailable, name: 'Derived unavailable' }
