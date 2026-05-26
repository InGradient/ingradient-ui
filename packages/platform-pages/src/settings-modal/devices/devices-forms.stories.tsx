import type { Meta, StoryObj } from '@storybook/react-vite'
import { DevicesForms, type DeviceOption } from './devices-forms'

const noop = () => undefined

const devices: DeviceOption[] = [
  { id: 'd-1', deviceUid: 'ABC-123-XYZ', name: 'Edge-A1' },
  { id: 'd-2', deviceUid: 'DEF-456-UVW', name: null },
  { id: 'd-3', deviceUid: 'GHI-789-RST', name: 'Edge-B2' },
]

const baseArgs = {
  isAdmin: true,
  offlineEnabled: true,
  registerUid: '', onChangeRegisterUid: noop,
  registerName: '', onChangeRegisterName: noop,
  onRegister: noop,
  issueDeviceId: 'd-1', onChangeIssueDeviceId: noop,
  issueValidDays: '14', onChangeIssueValidDays: noop,
  onIssue: noop,
  activeDevices: devices,
}

const meta: Meta<typeof DevicesForms> = {
  title: 'Platform Pages/Devices/DevicesForms',
  component: DevicesForms,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 720, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = { args: baseArgs }
export const RegisterFormOpen: Story = { args: { ...baseArgs, showRegister: true } }
export const RegisterFilled: Story = {
  args: { ...baseArgs, showRegister: true, registerUid: 'XYZ-1234', registerName: 'Edge-test' },
}
export const Registering: Story = {
  args: { ...baseArgs, showRegister: true, registerUid: 'XYZ-1234', registering: true },
}
export const RegisterError: Story = {
  args: { ...baseArgs, showRegister: true, registerUid: 'X', registerError: 'Device UID already exists.' },
}

export const IssueFormOpen: Story = { args: { ...baseArgs, showIssue: true } }
export const Issuing: Story = { args: { ...baseArgs, showIssue: true, issuing: true } }
export const IssueNoDevices: Story = {
  args: { ...baseArgs, showIssue: true, activeDevices: [], issueDeviceId: '' },
}

export const TokenIssued: Story = {
  args: {
    ...baseArgs,
    issuedToken: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGdlLWExIiwidmFsaWRVbnRpbCI6IjIwMjctMDEtMDFUMDA6MDA6MDBaIn0.signature',
      validUntil: '2027-01-01T00:00:00Z',
      deviceUid: 'ABC-123-XYZ',
    },
  },
}

export const NonAdminWithToken: Story = {
  args: {
    ...baseArgs,
    isAdmin: false,
    issuedToken: TokenIssued.args!.issuedToken,
  },
}
