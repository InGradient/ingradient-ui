// ConnectionTabView (Edge Settings > connection 탭) 스토리용 fixture 데이터.
import type {
  AnyCamera,
  ConnectionLabels,
  GuideState,
  NicCandidate,
  NicStatus,
} from '@ingradient/edge-pages'

export const CONNECTION_LABELS: ConnectionLabels = {
  scanTitle: 'Scan',
  scan: 'Scan',
  scanning: 'Scanning...',
  scanHint: 'Connect the camera and click Scan to discover devices.',
  cameras: 'Cameras',
  nicCandidates: 'Network adapters',
  noDevices: 'No devices found',
  notReachable: 'Not reachable',
  reachable: 'Reachable',
  forceIp: 'Force IP',
  connectTitle: 'Connect',
  connect: 'Connect',
  disconnect: 'Disconnect',
  connecting: 'Connecting...',
  connectError: 'Connection failed',
  diagnosticsTitle: 'Diagnostics',
  runDiagnose: 'Run diagnose',
  diagnosing: 'Diagnosing...',
  nicControlTitle: 'NIC control',
  nicEnable: 'Enable',
  nicDisable: 'Disable',
  nicRestart: 'Restart',
  profileTitle: 'Profile',
  loadProfile: 'Load profile',
  saveProfile: 'Save profile',
  advancedTitle: 'Advanced',
  forceIpDialogTitle: 'Force IP',
  forceIpApply: 'Apply',
  forceIpCancel: 'Cancel',
  forceIpApplying: 'Applying...',
  forceIpStaticIp: 'Static IP',
  forceIpSubnet: 'Subnet mask',
  classificationMessages: {
    success: 'Camera connected successfully.',
    no_nic: 'No suitable network adapter found.',
    no_camera: 'No camera detected on the network.',
    subnet_mismatch: 'Camera and adapter are on different subnets.',
    firewall_block: 'A firewall is blocking the camera connection.',
    driver_missing: 'The required camera driver is not installed.',
    unknown: 'An unknown error occurred.',
  },
  guideMessages: {
    scan: 'Scan for available cameras.',
    select_nic: 'Select a network adapter.',
    select_camera: 'Select a camera to connect.',
    connect: 'Connect to the selected camera.',
    diagnose: 'Run diagnostics to find the problem.',
    done: 'Setup complete.',
  },
  nicBadgeRecommended: 'Recommended',
  nicBadgePossible: 'Possible',
  nicBadgeUnsuitable: 'Unsuitable',
}

export const SAMPLE_DISCOVERED_DEVICES: AnyCamera[] = [
  {
    type: 'gige',
    ip: '192.168.1.10',
    mac: '00:11:22:33:44:55',
    manufacturer: 'Basler',
    model: 'acA1920-40gc',
    reachable: true,
  },
  {
    type: 'gige',
    ip: '169.254.5.20',
    mac: '00:11:22:33:44:66',
    manufacturer: 'FLIR',
    model: 'BFS-PGE-50S5C',
    reachable: false,
  },
  {
    type: 'usb',
    index: 0,
    name: 'Logitech Webcam C920',
    width: 1920,
    height: 1080,
  },
]

export const SAMPLE_NIC_CANDIDATES: NicCandidate[] = [
  {
    name: 'Ethernet 2',
    description: 'Intel(R) Ethernet I210',
    ipv4: '192.168.1.1',
    status: 'Up',
    badge: 'recommended',
  },
  {
    name: 'Ethernet 1',
    description: 'Realtek PCIe GbE Family Controller',
    ipv4: '10.0.0.5',
    status: 'Up',
    badge: 'possible',
  },
  {
    name: 'Wi-Fi',
    description: 'Intel(R) Wireless-AC 9560',
    ipv4: null,
    status: 'Down',
    badge: 'unsuitable',
  },
]

export const SAMPLE_NIC_STATUS: NicStatus = {
  nicId: 'Ethernet 2',
  speed: '1 Gbps',
  duplexMode: 'Full',
  isAdminUp: true,
  isLinkUp: true,
  configErrors: [],
}

export const SAMPLE_GUIDE_STATE: GuideState = {
  step: 'select_camera',
  message: 'Select a camera to connect.',
  recoveryHint: 'Make sure the camera is powered on and connected.',
}
