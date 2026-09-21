import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button, Stack } from '@ingradient/ui'
import type { AccountUser, LightingMode, SettingsTab } from '@ingradient/edge-pages'
import { defineHandoff } from '../../../support/handoff'
import { SettingsModal } from './settings/build-settings-modal'
import { useSettingsDraft, type MockAction } from './settings/tabs-moved'
import { AccountRuntime, LanguageRuntime } from './settings/account-runtime'
import { SystemMonitorRuntime } from './settings/system-runtime'
import { SAMPLE_USER } from '../../../fixtures/edge/0.0.5'

interface WorkflowArgs { initialTab: SettingsTab; lightingMode: LightingMode; chromeOnly: boolean; onMockAction: MockAction }
function SettingsWorkflowScene({ initialTab, lightingMode, chromeOnly, onMockAction }: WorkflowArgs) {
  const draft = useSettingsDraft()
  const [open, setOpen] = useState(!chromeOnly)
  const [language, setLanguage] = useState('en')
  const [user, setUser] = useState<AccountUser | null>(SAMPLE_USER)
  return <Stack gap="var(--ig-space-4)" style={{ padding: 'var(--ig-space-5)' }}>
    <h1>Synthetic settings workflows</h1>
    <p>No authentication, hardware, files, clipboard, network, or OS calls.</p>
    <LanguageRuntime value={language} onChange={setLanguage} onMockAction={onMockAction} />
    <output aria-label="Selected mock language">{language}</output>
    <AccountRuntime currentUser={user} onUserChange={setUser} onMockAction={onMockAction} />
    <output aria-label="Selected mock account">{user?.email ?? 'signed out'}</output>
    <Button onClick={() => setOpen(true)}>Open mock settings</Button>
    <SystemMonitorRuntime onMockAction={onMockAction} />
    {open && <SettingsModal initialTab={initialTab} lightingMode={lightingMode} draft={draft} onMockAction={onMockAction} onClose={() => setOpen(false)} />}
  </Stack>
}
const meta = {
  title: 'Pages/Edge/0.0.5/SettingsWorkflows', component: SettingsWorkflowScene,
  args: { initialTab: 'server', lightingMode: 'deflectometry', chromeOnly: false, onMockAction: fn() },
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, ...defineHandoff({ service: 'edge', version: '0.0.5', page: 'SettingsWorkflows', referenceStory: 'Pages / Edge / 0.0.5 / SettingsWorkflows / DeviceDraft', preset: 'edge-0.0.1', fixturesPath: 'stories/fixtures/edge/0.0.5/*', requiredScenarios: ['device-draft', 'force-ip', 'logs', 'lighting-ps', 'cache-cleanup', 'field-test', 'about-update', 'account-language', 'system-cleanup'], interactions: ['Session-local mock settings and explicit synthetic outcomes'], platformIntegration: ['No real hardware, network, authentication, or file operations'] }) },
} satisfies Meta<typeof SettingsWorkflowScene>
export default meta
type Story = StoryObj<typeof meta>

export const DeviceDraft: Story = {
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    const url = page.getByLabelText('Base URL')
    await userEvent.clear(url); await userEvent.type(url, 'invalid')
    await userEvent.click(page.getByRole('button', { name: 'Save' }))
    await expect(page.getByText('Enter a valid HTTP or HTTPS URL.')).toBeVisible()
    await userEvent.clear(url); await userEvent.type(url, 'https://mock.example.test')
    await userEvent.click(page.getByRole('button', { name: 'Save' }))
    await expect(page.getByText(/Mock settings saved in this session/)).toBeVisible()
    await userEvent.click(page.getByRole('tab', { name: 'Camera' }))
    const dll = page.getByLabelText('cvsCam DLL Path')
    await userEvent.clear(dll); await userEvent.type(dll, 'mock-camera.dll')
    await userEvent.click(page.getByRole('button', { name: 'Apply' }))
    await expect(page.getByText(/Mock camera apply complete/)).toBeVisible()
    await userEvent.click(page.getByRole('tab', { name: 'Server' }))
    await expect(page.getByLabelText('Base URL')).toHaveValue('https://mock.example.test')
    await userEvent.keyboard('{Escape}')
    await userEvent.click(page.getByRole('button', { name: 'Open mock settings' }))
    await expect(page.getByLabelText('Base URL')).toHaveValue('https://mock.example.test')
    await userEvent.click(page.getByRole('tab', { name: 'Camera' }))
    await expect(page.getByLabelText('cvsCam DLL Path')).toHaveValue('mock-camera.dll')
    await expect(args.onMockAction).toHaveBeenCalledWith('camera-apply', expect.objectContaining({ synthetic: true }))
  },
}

export const ForceIp: Story = {
  args: { initialTab: 'connection' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Force IP' }))
    const ip = page.getByLabelText('Static IP')
    await userEvent.clear(ip); await userEvent.type(ip, '999.1.2.3')
    await userEvent.click(within(page.getByRole('dialog', { name: 'Force IP' })).getByRole('button', { name: 'Apply' }))
    await expect(page.getByRole('alert')).toHaveTextContent('valid IPv4')
    await userEvent.clear(ip); await userEvent.type(ip, '192.168.1.42')
    await userEvent.click(within(page.getByRole('dialog', { name: 'Force IP' })).getByRole('button', { name: 'Apply' }))
    await expect(page.queryByRole('dialog', { name: 'Force IP' })).not.toBeInTheDocument()
    await expect(page.getByText(/Mock force-ip complete/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('force-ip-applied', expect.objectContaining({ ip: '192.168.1.42', synthetic: true }))
  },
}

export const Logs: Story = {
  args: { initialTab: 'logs' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    const query = page.getByRole('searchbox', { name: 'Filter (message, module...)' })
    await userEvent.type(query, 'capture-agent')
    await expect(page.getByText(/capture-agent started/)).toBeVisible()
    await expect(page.queryByText(/cvsCam device opened/)).not.toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'Copy all' }))
    await expect(page.getByText('Mock export prepared: 1 backend entries. No file written.')).toBeVisible()
    await userEvent.clear(query)
    await userEvent.click(page.getByRole('button', { name: 'Minimum log level' }))
    await userEvent.click(page.getByRole('option', { name: 'Warn' }))
    await expect(page.queryByText(/capture-agent started/)).not.toBeInTheDocument()
    await expect(page.getByText(/frame interval/)).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Clear' }))
    await expect(page.getByText('No logs')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Refresh' }))
    await expect(page.getByText(/frame interval/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('settings-logs-clear', 'backend')
    await userEvent.click(page.getByRole('button', { name: 'Minimum log level' }))
    await userEvent.click(page.getByRole('option', { name: 'All' }))
    await userEvent.click(page.getByRole('radio', { name: 'Frontend' }))
    await expect(page.getByText(/UI mounted/)).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Copy all' }))
    await expect(page.getByText('Mock export prepared: 3 frontend entries. No file written.')).toBeVisible()
  },
}

export const LightingPs: Story = {
  args: { initialTab: 'lighting', lightingMode: 'photometric-stereo' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'All on' }))
    for (const checkbox of page.getAllByRole('checkbox').slice(0, 4)) await expect(checkbox).toBeChecked()
    await userEvent.click(page.getByRole('button', { name: 'All off' }))
    await userEvent.click(page.getByRole('tab', { name: 'Server' }))
    await userEvent.click(page.getByRole('tab', { name: 'Lighting' }))
    for (const checkbox of page.getAllByRole('checkbox').slice(0, 4)) await expect(checkbox).not.toBeChecked()
    await expect(args.onMockAction).toHaveBeenCalledWith('lighting-all-off')
  },
}

export const CacheCleanup: Story = {
  args: { initialTab: 'data' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Clean Cache' }))
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog', { name: 'Clean mock cache?' })).not.toBeInTheDocument()
    await expect(page.getByRole('dialog', { name: 'System Settings' })).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Clean Cache' }))
    await userEvent.click(page.getByRole('button', { name: 'Confirm mock action' }))
    await userEvent.keyboard('{Escape}')
    await userEvent.click(page.getByRole('button', { name: 'Open mock settings' }))
    await waitFor(() => expect(page.getByText(/Mock cache cleanup complete/)).toBeVisible(), { timeout: 4000 })
    await expect(args.onMockAction).toHaveBeenCalledWith('data-clean-cache')
  },
}

export const FieldTest: Story = {
  args: { initialTab: 'fieldtest' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Run' }))
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(page.getByText('Mock field test cancelled.')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Run' }))
    await userEvent.click(page.getByRole('tab', { name: 'Server' }))
    await userEvent.click(page.getByRole('tab', { name: 'Field Test' }))
    await waitFor(() => expect(page.getByText('Mock field test complete.')).toBeVisible(), { timeout: 4000 })
    await userEvent.click(page.getByRole('button', { name: 'Export' }))
    await expect(page.getByText(/Mock field test export prepared/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('field-test-cancel')
  },
}

export const AboutUpdate: Story = {
  args: { initialTab: 'about' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Deactivate License' }))
    await userEvent.click(page.getByRole('button', { name: 'Confirm mock action' }))
    await expect(page.getByRole('dialog', { name: 'Deactivation Code' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog', { name: 'Deactivation Code' })).not.toBeInTheDocument()
    await expect(page.getByRole('dialog', { name: 'System Settings' })).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Check for Updates' }))
    await waitFor(() => expect(page.getByRole('button', { name: 'Download' })).toBeVisible(), { timeout: 4000 })
    await userEvent.click(page.getByRole('button', { name: 'Download' }))
    await waitFor(() => expect(page.getByRole('button', { name: 'Install & Restart' })).toBeVisible(), { timeout: 4000 })
    await userEvent.click(page.getByRole('button', { name: 'Install & Restart' }))
    await expect(page.getByText(/Mock update install requested/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('license-deactivate')
    await expect(args.onMockAction).toHaveBeenCalledWith('update-install')
  },
}

export const AccountLanguage: Story = {
  args: { chromeOnly: true },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Language' }))
    await userEvent.click(page.getByRole('option', { name: '한국어' }))
    await expect(page.getByLabelText('Selected mock language')).toHaveTextContent('ko')
    await userEvent.click(page.getByRole('button', { name: /Account: JOON HO LEE/ }))
    await userEvent.click(page.getByRole('menuitem', { name: 'Change Account' }))
    await userEvent.click(page.getByRole('button', { name: /Mock Operator/ }))
    await expect(page.getByLabelText('Selected mock account')).toHaveTextContent('operator@example.test')
    await expect(args.onMockAction).toHaveBeenCalledWith('language-change', 'ko')
    await expect(args.onMockAction).toHaveBeenCalledWith('account-change', expect.objectContaining({ email: 'operator@example.test' }))
  },
}

export const SystemCleanup: Story = {
  args: { chromeOnly: true },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Open system monitor' }))
    await userEvent.click(page.getByRole('tab', { name: 'Cleanup' }))
    await userEvent.click(page.getByRole('button', { name: 'Clean selected mock data' }))
    await userEvent.click(page.getByRole('button', { name: 'Confirm mock action' }))
    await userEvent.keyboard('{Escape}')
    await userEvent.click(page.getByRole('button', { name: 'Open system monitor' }))
    await waitFor(() => expect(page.getByText(/Mock cleanup complete:/)).toBeVisible(), { timeout: 4000 })
    await expect(args.onMockAction).toHaveBeenCalledWith('system-cleanup-start', ['logs', 'thumbs'])
  },
}
