---
title: Phase 10 — Connection sub-tab 14 파일 추출
purpose: ingradient-edge 의 settings/connection/ 14 파일 (~2000줄, GigE 카메라 connection 워크플로우) 을 @ingradient/edge-pages/connection 으로 pure view 추출
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-9-spec.md
---

# Phase 10 — Connection sub-tab 14 파일 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 10
> 가장 도메인 특화 — GigE camera scan / connect / diagnose / NIC / profile 워크플로우. Phase 9 의 CameraSettingsDialog 의 `connectionContent` slot 실체화.

---

## 1. 목적

`packages/edge-pages/src/connection/` 에 settings/connection/ 14 파일 추출.

Phase 9 의 CameraSettingsDialog 가 받는 `connectionContent` slot 의 실체. **edge 의 가장 도메인 특화 영역** — GigE 카메라 ↔ NIC 매핑 / IP 강제 설정 / 진단 / 자동 설정.

---

## 2. 14 파일 + 의존

| 파일 | 줄 | i18n | store | IPC / hook | 결정 |
|---|---|---|---|---|---|
| `ConnectionTab.tsx` | **508** | ✅ | useDeviceStore + useCameraStore | useConnectionWorkflow + useNicOperations + AGENT_URL + helpers + profile-config-client | shell (multi-file 분해 필수) |
| `ConnectionTab.styles.ts` | 135 | - | - | - | 그대로 |
| `ScanSection.tsx` | 132 | ✅ | useConnectionWorkflow 결과 props | 없음 | pure |
| `ConnectSection.tsx` | 119 | ✅ | props | 없음 | pure |
| `AutoSetupSection.tsx` | 89 | ✅ | props | 없음 | pure |
| `DiagnosticsSection.tsx` | 206 | ✅ | props | 없음 | pure (multi-file 검토) |
| `DiagnoseClassificationCard.tsx` | 39 | ✅ | props | 없음 | pure |
| `AdvancedSection.tsx` | 100 | ✅ | props | 없음 | pure |
| `NicControlSection.tsx` | 129 | ✅ | props | 없음 | pure |
| `NicStatusCard.tsx` | 117 | ✅ | props | 없음 | pure |
| `ProfileStatusSection.tsx` | 70 | ✅ | props | 없음 | pure |
| `ConnectionGuidePanel.tsx` | 140 | ✅ | props | 없음 | pure |
| `ForceIpDialog.tsx` | 143 | ✅ | 없음 | 없음 | pure |
| `ForceIpDialog.styles.ts` | 78 | - | - | - | 그대로 |

13 view 중 **1개 (ConnectionTab) 만 IPC/store/hook 직접 의존**. 나머지 12 view 는 ConnectionTab 의 props 결과를 받아 render — 이미 props-driven 에 가까움. extraction 비용 상대적으로 낮음.

---

## 3. 모듈 구조

```
packages/edge-pages/src/connection/
├─ ConnectionTabView.tsx                 — shell (≤ 200 줄, 분해 후)
├─ ConnectionTabView.styles.ts           — ConnectionTab.styles.ts 그대로 (135줄)
├─ sections/
│  ├─ ScanSectionView.tsx                — 132줄 그대로
│  ├─ ConnectSectionView.tsx             — 119줄 그대로
│  ├─ AutoSetupSectionView.tsx           — 89줄 그대로
│  ├─ DiagnosticsSectionView.tsx         — 206줄 (multi-file 검토)
│  ├─ DiagnoseClassificationCardView.tsx — 39줄 그대로
│  ├─ AdvancedSectionView.tsx            — 100줄 그대로
│  ├─ NicControlSectionView.tsx          — 129줄 그대로
│  ├─ NicStatusCardView.tsx              — 117줄 그대로
│  ├─ ProfileStatusSectionView.tsx       — 70줄 그대로
│  ├─ ConnectionGuidePanelView.tsx       — 140줄 그대로
│  └─ index.ts
├─ ForceIpDialogView.tsx                 — 143줄 그대로
├─ ForceIpDialogView.styles.ts           — 78줄 그대로
├─ types.ts                              — 12 view props + workflow types
└─ index.ts                              — barrel
```

총 ~17 파일.

**ConnectionTab 508줄 분해**: 책임 매핑 후 결정:

- `useConnectionWorkflow` 호출 + state — container
- `useNicOperations` 호출 + state — container
- helpers (autoSelectCamera / autoSelectNic / deriveConnectionGuideState / runPreflightCheck) 호출 — container
- `loadEffectiveConfig` / `saveProfileSettings` (IPC clients) — container
- preflight check + retry — container
- `formatRecoveryFailure` — container
- **render JSX (마지막 ~150 줄)** — view 추출 대상

view JSX 만 추출하면 ≤ 200. 단 props surface 가 매우 큼 — group object 패턴 필수.

---

## 4. Props Interface

### 4.1 ConnectionTabViewProps

```ts
export interface ConnectionTabLabels {
  // section titles
  scan: string
  autoSetup: string
  connect: string
  diagnostics: string
  advanced: string
  nicControl: string
  profileStatus: string

  // sub-view labels
  scanSection: ScanSectionLabels
  connectSection: ConnectSectionLabels
  autoSetupSection: AutoSetupSectionLabels
  diagnosticsSection: DiagnosticsSectionLabels
  advancedSection: AdvancedSectionLabels
  nicControlSection: NicControlSectionLabels
  nicStatusCard: NicStatusCardLabels
  profileStatusSection: ProfileStatusSectionLabels
  connectionGuidePanel: ConnectionGuidePanelLabels
  forceIpDialog: ForceIpDialogLabels
}

export interface ConnectionTabViewProps {
  // ── scan section (props group) ──
  scan: {
    isScanning: boolean
    cameras: CameraEntry[]
    nics: NicEntry[]
    selectedCameraId: string | null
    selectedNicId: string | null
    onScan: () => void
    onSelectCamera: (id: string) => void
    onSelectNic: (id: string) => void
  }

  // ── connect section ──
  connect: {
    isConnecting: boolean
    isConnected: boolean
    connectionError: string | null
    canConnect: boolean                         // selected cam + nic 있음
    onConnect: () => void
    onDisconnect: () => void
  }

  // ── auto setup ──
  autoSetup: {
    visible: boolean
    isRunning: boolean
    onRun: () => void
  }

  // ── diagnostics ──
  diagnostics: {
    isRunning: boolean
    classification: ConnectionClassification | null
    failureCode: string | null
    recoveryFailure: string | null
    onRunDiagnose: () => void
  }

  // ── nic control ──
  nicControl: {
    nicStatus: NicStatus | null
    isApplying: boolean
    onEnable: (nicId: string) => void
    onDisable: (nicId: string) => void
    onRestart: (nicId: string) => void
  }

  // ── profile ──
  profile: {
    profileName: string | null
    isLoading: boolean
    isSaving: boolean
    onLoad: () => void
    onSave: () => void
  }

  // ── advanced ──
  advanced: {
    dllPath: string
    expanded: boolean
    onToggleExpanded: () => void
    onDllPathChange: (path: string) => void
  }

  // ── connection guide ──
  guide: {
    visible: boolean
    state: GuideState
    onDismiss: () => void
  }

  // ── force IP dialog (slot) ──
  forceIpDialog?: React.ReactNode               // open 시 caller 가 mount

  // logs (read-only)
  logs: { timestamp: string; level: string; message: string }[]

  // i18n
  labels: ConnectionTabLabels
}
```

설계 노트:

- **9 props group** — scan / connect / autoSetup / diagnostics / nicControl / profile / advanced / guide / logs. group object 패턴 ([package-plan §9.3](./edge-pages-package-plan.md)) 가장 본격적인 적용.
- workflow hook 결과는 모두 group 안 prop 으로 평면화.
- ForceIpDialog 는 slot — 본 phase 안에 view 정의 있으나 mount 자체는 caller.

### 4.2 Sub-view props (요약)

각 section view 는 위 group object 안 prop 셋 + labels 의 sub-labels 받음. 예:

```ts
export interface ScanSectionViewProps {
  isScanning: boolean
  cameras: CameraEntry[]
  nics: NicEntry[]
  selectedCameraId: string | null
  selectedNicId: string | null
  labels: ScanSectionLabels
  onScan: () => void
  onSelectCamera: (id: string) => void
  onSelectNic: (id: string) => void
}
```

ConnectionTabView 는 `scan` group 을 그대로 `<ScanSectionView {...scan} labels={labels.scanSection} />` 로 spread.

### 4.3 도메인 types

```ts
// types.ts

export interface CameraEntry {
  cameraId: string
  cameraName: string
  ipAddress: string | null
  status: 'available' | 'in_use' | 'unreachable'
  signalStrength?: number
}

export interface NicEntry {
  nicId: string
  nicName: string
  ipAddress: string | null
  enabled: boolean
  linkStatus: 'up' | 'down' | 'unknown'
  packetLoss?: number
}

export interface NicStatus {
  nicId: string
  speed: string                                   // "1 Gbps"
  duplexMode: string                              // "Full"
  isAdminUp: boolean
  isLinkUp: boolean
  configErrors: string[]
}

export type ConnectionClassification =
  | 'success'
  | 'no_nic'
  | 'no_camera'
  | 'subnet_mismatch'
  | 'firewall_block'
  | 'driver_missing'
  | 'unknown'

export interface GuideState {
  step: 'scan' | 'select_nic' | 'select_camera' | 'connect' | 'diagnose' | 'done'
  message: string                                 // already translated
  recoveryHint?: string
}
```

### 4.4 ForceIpDialogViewProps

```ts
export interface ForceIpDialogLabels {
  title: string
  cancel: string
  apply: string
  applying: string
  staticIp: string
  subnet: string
  // ~10 key
}

export interface ForceIpDialogViewProps {
  cameraId: string
  currentIp: string | null
  newIp: string
  newSubnet: string
  applying: boolean
  error: string | null
  labels: ForceIpDialogLabels
  onIpChange: (ip: string) => void
  onSubnetChange: (subnet: string) => void
  onApply: () => void
  onCancel: () => void
}
```

---

## 5. 변경 파일

### 5.1 신규 (~17 file)

§3 의 connection/ 17 파일.

### 5.2 수정 (1 file)

```diff
  export * from './settings'
+ export * from './connection'
```

### 5.3 신규 story

```
stories/pages/edge/0.0.1/connection/
├─ ConnectionTabView.stories.tsx          — 6 scenario (Initial / Scanning / WithCameras / Connected / DiagnoseFailed / GuideStep)
├─ ScanSectionView.stories.tsx            — 4 scenario
├─ ConnectSectionView.stories.tsx         — 4 scenario (Disconnected / Connecting / Connected / Error)
├─ AutoSetupSectionView.stories.tsx       — 3 scenario
├─ DiagnosticsSectionView.stories.tsx     — 6 scenario (Idle / Running / Success / SubnetMismatch / FirewallBlock / DriverMissing)
├─ NicControlSectionView.stories.tsx      — 4 scenario
├─ NicStatusCardView.stories.tsx          — 4 scenario (Healthy / LinkDown / SlowSpeed / WithErrors)
├─ ProfileStatusSectionView.stories.tsx   — 3 scenario
├─ ConnectionGuidePanelView.stories.tsx   — 6 scenario (각 step 별 1개)
├─ AdvancedSectionView.stories.tsx        — 2 scenario (Collapsed / Expanded)
├─ DiagnoseClassificationCardView.stories.tsx — 7 scenario (각 classification 별)
└─ ForceIpDialogView.stories.tsx          — 4 scenario (Empty / Filled / Applying / Error)
```

총 12 story × 2~7 scenario = ~53 scenario.

신규 fixture:
- `stories/fixtures/edge/0.0.1/connection.ts` — CameraEntry[] / NicEntry[] / NicStatus / GuideState mock

### 5.4 건드리지 않음

- `ingradient-edge/src/frontend/components/settings/connection/*` — Phase 13
- `ingradient-edge/src/frontend/modules/settings/connection/*` — Phase 13

---

## 6. i18n 키 매핑 (요약)

총 ~80 key. 본 spec 본문에 전부 나열 안 함. Phase 13 의 helper hook 으로 묶음.

요약:
- ConnectionTabLabels: ~10 key (section titles + sub-labels Record)
- ScanSectionLabels: ~8 key
- ConnectSectionLabels: ~6 key
- AutoSetupSectionLabels: ~5 key
- DiagnosticsSectionLabels: ~15 key (classification 별 메시지)
- AdvancedSectionLabels: ~5 key
- NicControlSectionLabels: ~8 key
- NicStatusCardLabels: ~8 key
- ProfileStatusSectionLabels: ~5 key
- ConnectionGuidePanelLabels: ~12 key (step 별 메시지)
- ForceIpDialogLabels: ~10 key

---

## 7. 실행 순서

1. `connection/types.ts` — 12 view props + 도메인 types
2. styles 이전:
   - `connection/ConnectionTabView.styles.ts`
   - `connection/ForceIpDialogView.styles.ts`
3. sub-view (의존성 적은 순):
   - `connection/sections/DiagnoseClassificationCardView.tsx` (39줄, 의존 0)
   - `connection/sections/NicStatusCardView.tsx`
   - `connection/sections/ScanSectionView.tsx`
   - `connection/sections/ConnectSectionView.tsx`
   - `connection/sections/AutoSetupSectionView.tsx`
   - `connection/sections/AdvancedSectionView.tsx`
   - `connection/sections/NicControlSectionView.tsx`
   - `connection/sections/ProfileStatusSectionView.tsx`
   - `connection/sections/ConnectionGuidePanelView.tsx`
   - `connection/sections/DiagnosticsSectionView.tsx`
   - `connection/sections/index.ts`
4. `connection/ForceIpDialogView.tsx`
5. shell:
   - `connection/ConnectionTabView.tsx`
6. `connection/index.ts`
7. `packages/edge-pages/src/index.ts` 수정
8. fixtures + stories
9. typecheck + build + storybook build

---

## 8. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `find packages/edge-pages/src/connection -type f \| wc -l` | ~17 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | ConnectionTab + 12 sub-view export |
| 4 | 모든 파일 `wc -l` | 모두 < 200 |
| 5 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 6 | `npm run build:storybook` | exit 0 |
| 7 | Storybook 수동 — ~53 scenario | 모두 props 만으로 렌더 |
| 8 | grep — 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next\|fetch(\|useConnectionWorkflow\|useNicOperations\|useDeviceStore\|useCameraStore\|loadEffectiveConfig\|saveProfileSettings' packages/edge-pages/src/connection/` → 0 match |
| 9 | Phase 9 의 dialog 와 통합 — story 한 scenario 에서 CameraSettingsDialogView 의 connectionContent slot 에 ConnectionTabView 마운트 | 정상 렌더 |

---

## 9. 성공 기준

- 검증 1~9 통과
- 12 view 가 store/IPC/i18n/fetch 의존 0
- ~53 storybook scenario 가 props 만으로 렌더
- 모든 파일 < 200 줄 (ConnectionTab 508 → shell + 9 sub-section + 1 dialog 로 분해)
- 9 props group 패턴 적용 — 가장 본격적인 group object 사용
- Phase 9 의 CameraSettingsDialog 의 `connectionContent` slot 에 plug-in 가능

---

## 10. 리스크

### 10.1 ConnectionTab 508 → shell ≤ 200 분해

위험: shell 이 props group 9개 + labels + slot 받고 render. spread 만 해도 ~150 줄.

대응:
- spread + sub-view render 만 (분기 최소화)
- 모든 logic 은 container 가 props 결정 후 전달
- 200 줄 미달 가능

### 10.2 props group 9개 의 caller 측 코드 비대화

위험: ingradient-edge container 가 9 group object 를 매번 만들면 코드 폭증 (Phase 13).

대응:
- container 측 helper hook `useConnectionTabProps()` (Phase 13 에서 작성) 로 모든 group 한 곳에 묶음
- 본 phase 의 view 는 group object 시그니처만 정의 — caller 사정 모름

### 10.3 도메인 types 의 광범위함

위험: CameraEntry / NicEntry / NicStatus / ConnectionClassification / GuideState — edge 의 module types 와 정확히 매칭 필요.

대응:
- 본 phase 시작 전 `modules/settings/connection/model/types.ts` 확인 + 일치
- typecheck 로 즉시 검증

### 10.4 `recoveryFailure` 의 i18n 처리

위험: `formatRecoveryFailure` 가 i18n 처리된 string 생성. view 안 호출하면 의존성 누출.

대응:
- container 가 `formatRecoveryFailure` 호출 후 string props 로 전달
- view 의 `recoveryFailure: string | null` 받음

### 10.5 DiagnosticsSection 206 → 분해 여부

위험: 206줄 — 200 룰 미세 초과.

대응:
- DiagnoseClassificationCard 가 이미 별도 39줄 — 추가 분해 불필요
- DiagnosticsSection 안 6줄 정도 줄여서 200 미달 가능 (deprecated 코드 또는 boilerplate 제거)
- 또는 DiagnosticsSection 의 result list 만 sub-view (DiagnosticsResultsList) 로 분해

### 10.6 ConnectionGuidePanel 의 step 별 분기

위험: 6 step (scan / select_nic / select_camera / connect / diagnose / done) 분기로 view 안 분기 복잡.

대응:
- step 별 sub-view 분해 가능하나 본 phase 에선 단일 file 안 switch 그대로
- 140줄 ≤ 200 라 OK
- 향후 step 추가 시 분해 검토

### 10.7 ForceIpDialog 의 IP validation

위험: `newIp` / `newSubnet` 입력 검증 (e.g. "192.168.1.10" 형식) 이 view 안 정규식.

대응:
- 검증은 visual feedback (input 빨강) 까지는 view 안 OK
- 실제 apply 차단은 container (`apply()` 안 검증)
- view 의 `error` prop 으로 error 메시지 표시

### 10.8 scan / nic 결과의 polling

위험: edge 는 useConnectionWorkflow 가 scan 결과를 polling 으로 업데이트.

대응:
- container 잔류
- view 는 cameras / nics array prop 만 받음 (매 render 마다 갱신)

---

## 11. Rollback

git revert. 산출물:
- `packages/edge-pages/src/connection/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 의 connection export 제거
- `stories/pages/edge/0.0.1/connection/` 삭제
- 신규 fixture 1개 삭제
- `npm run build --workspace packages/edge-pages` 재실행

---

## 12. 종료 후 상태

- `@ingradient/edge-pages` 가 45+ view export (Phase 1-9 누적 + Phase 10 의 12)
- props group 패턴 가장 본격적 적용 (9 group)
- Phase 9 의 connectionContent slot plug-in 완성
- 200줄 룰 위반 1 파일 (ConnectionTab 508) multi-file 분해 완료
- Phase 11 (RightPanel + LogPanel + SystemMonitor — 남은 큰 component) 진입 준비 완료

---

## 13. 다음 액션

1. 본 spec ok
2. 실행 (§7 의 9 step)
3. 검증 (§8 의 9 step)
4. Phase 11 spec 작성 (`edge-pages-phase-11-spec.md`)
