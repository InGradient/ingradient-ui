# pages/edge/0.0.1

Storybook stories for the **edge** Electron app — the 4 full screens of `ingradient-edge`:
**Login / License / DatasetSelect / Workspace**.

## Architecture

Screen-level View 는 `@ingradient/edge-pages` (workspace package at [`packages/edge-pages/`](../../../../packages/edge-pages/)) 에 추출돼 있다. 이 스토리들은 **thin orchestrator** 다:

- 각 `*.stories.tsx` 는 실제 앱(`ingradient-edge/src/frontend/app/App.tsx`)처럼 화면을
  **`EdgeAppShellView` 프레임(TitleBar + content + BottomBar + SystemMonitorModal)으로 통째로** 감싼다.
- 셸 합성은 edge-pages 를 수정하지 않고 **스토리 helper 에서** 한다 — [`shared/build-shell-slots.tsx`](shared/build-shell-slots.tsx).
- mock props / scene state 는 각 화면 폴더의 helper 로 분리한다 (`build-*.tsx`, `*-scene.tsx`).

동일 View 를 `ingradient-edge` 가 real store/hook 결과로 렌더한다.

## 페이지 트리

```
Pages/Edge/0.0.1/
├─ Login          EdgeAppShellView(content=LoginView)            — 로그인 전(footer 없음)
├─ License        EdgeAppShellView(content=LicenseView)          — 라이선스 게이트
├─ DatasetSelect  EdgeAppShellView(content=DatasetSelectView)    — Add/Export 모달 포함
└─ Workspace      EdgeAppShellView + MainLayoutView 전체 합성
     variants: Capture · Images · Statics · Setup · Capturing
               · Labeling · LabelingWithFailure
               · ImagesModalEdit · ImagesModalReadOnly
               · SettingsOpen · ConnectionOpen · LogFilterOpen · SystemMonitorOpen · Offline
```

`Workspace` 화면은 별도 화면이 아닌 **탭/패널/모달**을 모두 자기 안에서 소화한다:
images·statics·labeling·labeling-panel·log → 탭/패널 content, settings·connection·system → 모달.

부분 컴포넌트(chrome bar 들, 단독 CaptureView, DistanceMeasurement 인터랙션 demo)는
페이지가 아니므로 **`Components/Edge/0.0.1/`** 트리로 분리했다.

## 파일 layout

```
0.0.1/
├─ Login.stories.tsx / License.stories.tsx        # 셸 래핑된 화면
├─ DatasetSelect.stories.tsx
│  └─ dataset-select/{labels.ts, build-modals.tsx}
├─ Workspace.stories.tsx                           # variant export 만 (thin)
│  └─ workspace/
│     ├─ workspace-scene.tsx                       # EdgeAppShell + MainLayout 합성
│     ├─ build-capture-content.tsx                 # capture 탭 (CaptureView)
│     ├─ build-setup-content.tsx                   # setup 탭 (SetupPanelView)
│     ├─ build-images-content.tsx                  # images 탭 (ImagesView + 모달)
│     ├─ build-bbox-canvas.tsx                     # 라벨링 캔버스 (images 모달/labeling 공유)
│     ├─ build-statics-content.tsx                 # statics 탭 (StaticsView)
│     ├─ build-panels.tsx                          # 좌 Log / 우 RightPanel
│     ├─ build-settings-modal.tsx                  # Settings 다이얼로그(탭 7종)
│     ├─ build-connection-content.tsx              # Settings > connection 탭
│     └─ build-system-modal.tsx                    # SystemMonitor 모달
└─ shared/{labels.ts, build-shell-slots.tsx}       # 4개 화면 공유 셸/chrome
```

## Conventions

- **Story / helper 파일은 200줄 미만.** 합성 로직은 helper 폴더로.
- **UI 는 `@ingradient/edge-pages` View 만 렌더.** 패턴 직접 조립 금지.
- **Fixture 는 story 전용.** edge-pages View 는 `stories/fixtures/` 를 import 하지 않는다.
- `defineHandoff` 메타는 모든 화면 스토리에 유지.

## Fixtures

`stories/fixtures/edge/0.0.1/` — `account-history` · `dataset-groups` · `workspace-tabs` ·
`sample-images` · `system-stats` · `devices` (기존) + `statics-data` · `log-entries` ·
`settings-data` · `connection-data` · `system-monitor` (Workspace 탭/모달용 신규).

상위 문서: [pages/edge/README.md](../README.md)
