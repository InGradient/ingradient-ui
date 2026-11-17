// Top bar and footer workflows: language, account change and the system monitor.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Settings005, * as S from '../0.0.5/SettingsWorkflows.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/App Chrome/Workflows',
  component: Settings005.component,
  args: { ...Settings005.args, chromeOnly: true },
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'App Chrome',
    referenceStory: 'Pages / Edge / 0.0.6 / App Chrome / Workflows / Language and account',
    fixturesPath: 'stories/fixtures/edge/0.0.5/*',
    requiredScenarios: ['language-account', 'system-cleanup'],
    interactions: ['Local account change and locale selection; not authentication or full translation'],
  }),
} satisfies Meta<typeof Settings005.component>

export default meta
type Story = StoryObj<typeof Settings005>

export const LanguageAccount: Story = { ...S.AccountLanguage, name: 'Language and account', play: paced(S.AccountLanguage.play) }
export const SystemCleanup: Story = { ...S.SystemCleanup, name: 'System cleanup', play: paced(S.SystemCleanup.play) }
