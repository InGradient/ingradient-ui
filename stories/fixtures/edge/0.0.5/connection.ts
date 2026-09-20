// 설정 > 연결 탭 fixture — 스캔 결과와 NIC 후보.
// 카메라가 "Not Reachable" 인데 연결은 되어 있는 상태가 현장에서 흔하다:
// LLA IP 는 유동이라 스캔이 잡은 주소와 실제 통신 주소가 어긋난다.
import type {
  AnyCamera, ConnectionLabels, GuideState, NicCandidate, NicStatus,
} from '@ingradient/edge-pages'

export const CONNECTION_LABELS: ConnectionLabels = {
  scanTitle: 'Scan',
  scan: 'Scan',
  scanning: 'Scanning...',
  scanHint: 'Scan for cameras and NIC adapters',
  cameras: 'Cameras',
  nicCandidates: 'NIC candidates',
  noDevices: 'No devices found',
  notReachable: 'Not Reachable',
  reachable: 'Reachable',
  forceIp: 'Force IP',
  connectTitle: 'Connect',
  connect: 'Connect',
  disconnect: 'Disconnect',
  connecting: 'Connecting...',
  connectError: 'Connection failed',
  diagnosticsTitle: 'Diagnostics',
  runDiagnose: 'Run Diagnostic',
  diagnosing: 'Diagnosing...',
  nicControlTitle: 'NIC control',
  nicEnable: 'Enable',
  nicDisable: 'Disable',
  nicRestart: 'Restart NIC',
  profileTitle: 'Camera profile',
  loadProfile: 'Load',
  saveProfile: 'Save',
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
  guideNetworkCameraIp: 'Camera IP',
  guideNetworkNicIp: 'NIC IP',
  guideNetworkJumbo: 'Jumbo',
  guideNetworkReceive: 'Receive',
  nicBadgeRecommended: 'Recommended',
  nicBadgePossible: 'Possible',
  nicBadgeUnsuitable: 'Unsuitable',
}

export const SAMPLE_CAMERAS: AnyCamera[] = [
  {
    type: 'gige',
    ip: '169.254.102.157',
    mac: '00:14:f7:01:9c:3d',
    manufacturer: 'Crevis Co., LTD',
    model: 'MG-A121M-9',
    reachable: false,
  },
]

/** 카메라 NIC 은 USB 2.5GbE 다 — 이 PC 에는 내장 이더넷이 없다. */
export const SAMPLE_NIC_CANDIDATES: NicCandidate[] = [
  {
    name: 'Ethernet',
    description: 'Realtek USB 2.5GbE Family Controller',
    ipv4: '169.254.171.176',
    status: 'Up',
    badge: 'recommended',
  },
  {
    name: 'Wi-Fi',
    description: 'Intel(R) Wi-Fi 6E AX211 160MHz',
    ipv4: '192.168.0.31',
    status: 'Up',
    badge: 'possible',
  },
  {
    name: 'vEthernet (WSL)',
    description: 'Hyper-V Virtual Ethernet Adapter',
    ipv4: '172.30.128.1',
    status: 'Up',
    badge: 'unsuitable',
  },
]

export const SAMPLE_NIC_STATUS: NicStatus = {
  nicId: 'Ethernet',
  speed: '2.5 Gbps',
  duplexMode: 'Full',
  isAdminUp: true,
  isLinkUp: true,
  configErrors: [],
}

export const SAMPLE_GUIDE_STATE: GuideState = {
  tone: 'success',
  statusLabel: 'Connected',
  title: 'Camera is streaming',
  summary: 'Frames are arriving. You can close Settings and use the capture screen.',
  primaryAction: { label: 'Restart connection', onClick: () => undefined },
  secondaryActions: [],
  network: {
    cameraIp: '169.254.102.157',
    nicIp: '169.254.171.176',
    jumbo: '9014',
    receive: 'Receive Buffers: 2048',
  },
  warnings: [],
}
