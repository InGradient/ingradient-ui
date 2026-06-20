// Connection 탭의 모든 라벨 (스토리 fixture / 앱 i18n 에서 주입).

import type { ConnectionClassification } from './domain'
import type { GuideStep } from './guide'

export interface ConnectionLabels {
  scanTitle: string
  scan: string
  scanning: string
  scanHint: string
  cameras: string
  nicCandidates: string
  noDevices: string
  notReachable: string
  reachable: string
  forceIp: string
  // connect
  connectTitle: string
  connect: string
  disconnect: string
  connecting: string
  connectError: string
  // diagnostics
  diagnosticsTitle: string
  runDiagnose: string
  diagnosing: string
  // nic / profile / guide
  nicControlTitle: string
  nicEnable: string
  nicDisable: string
  nicRestart: string
  profileTitle: string
  loadProfile: string
  saveProfile: string
  // advanced
  advancedTitle: string
  // forceIp
  forceIpDialogTitle: string
  forceIpApply: string
  forceIpCancel: string
  forceIpApplying: string
  forceIpStaticIp: string
  forceIpSubnet: string
  // classification messages
  classificationMessages: Record<ConnectionClassification, string>
  // guide messages
  guideMessages: Record<GuideStep, string>
  // guide panel network summary labels
  guideNetworkCameraIp: string
  guideNetworkNicIp: string
  guideNetworkJumbo: string
  guideNetworkReceive: string
  // badges
  nicBadgeRecommended: string
  nicBadgePossible: string
  nicBadgeUnsuitable: string
}
