# pages/edge/0.0.5

`ingradient-edge` **0.0.5 앱 화면 그대로**. 디자이너가 실제 화면과 나란히 놓고 볼 수 있게,
부품이 아니라 **창 전체**(타이틀바 → 내용 → 하단 상태바)를 띄운다.

## 화면

```
Pages/Edge/0.0.5/
├─ Login           로그인 — .ige 프로젝트 파일 + 저장된 계정
├─ DatasetSelect   Projects / Datasets — 최근 5개 + 프로젝트별 목록
└─ Workspace       촬영 화면 (Logs · Capture · Pattern Preview/Class · 하단바)
     Capture · Setup · Capturing · SequenceFailed · LogFilterOpen · Offline
     SettingsConnection · SettingsGeneral · SettingsLighting · SettingsExperiments
```

`Workspace` 의 `Settings*` 스토리가 **System Settings 다이얼로그**다 — 별도 화면이 아니라
촬영 화면 위에 뜬다. 탭 10개는 앱과 같은 순서로 선다.

## 데이터

문구는 edge 의 `src/frontend/locales/en.json` 값을, 데이터는 FINEMTECH 현장 구성을 옮겼다.
클래스 이름이 `정상: OK` 처럼 두 언어인 것도, 로그가 `[SEQ success id=…]` 인 것도 실제 그대로다.

fixtures: [`stories/fixtures/edge/0.0.5/`](../../../fixtures/edge/0.0.5/)

## 구조

각 `*.stories.tsx` 는 얇다. 합성은 helper 로 나눠 둔다.

```
0.0.5/
├─ shared/build-shell.tsx          # EdgeAppShellView 프레임 + TopBar/BottomBar 슬롯
├─ Login.stories.tsx
├─ DatasetSelect.stories.tsx
├─ Workspace.stories.tsx
│  └─ workspace/
│     ├─ workspace-scene.tsx       # EdgeAppShell + MainLayout 합성
│     ├─ build-capture-content.tsx # Capture 탭
│     ├─ build-setup-content.tsx   # Setup 탭(우측 셋업 패널)
│     └─ build-panels.tsx          # 좌 Logs / 우 Pattern Preview + Class
└─ settings/
   ├─ build-settings-modal.tsx     # 탭 10개 다이얼로그
   ├─ build-connection-content.tsx # 연결 탭 = 6단계 진단 + Scan
   ├─ build-camera-setup.tsx       # 6단계 진단 카드
   ├─ tabs-moved.tsx               # 옮긴 탭(일반·조명·실험)
   └─ tabs-legacy.tsx              # 기존 탭(서버·데이터·카메라·현장·정보·로그)
```

## 규칙

- **화면 전체를 띄운다.** 탭 하나만 보면 디자인이 어떻게 앉는지 알 수 없다
- **`@ingradient/edge-pages` View 만 렌더한다.** 스토리에서 컴포넌트를 새로 만들지 않는다
- **Story / helper 는 200줄 미만.** 합성은 helper 폴더로
- fixture 는 스토리 전용 — edge-pages View 는 `stories/fixtures/` 를 import 하지 않는다

## 아직 다른 곳

- 프로젝트 타입 태그가 `deflectometry_enabled` 로만 갈린다 — 앱의 `PHOTOMETRIC STEREO` 태그는 안 나온다
- 로그인 화면 좌상단 언어 선택이 앱에서는 아이콘, 여기서는 `EN` 텍스트 슬롯이다
- 라이브 프리뷰 이미지는 비워 뒀다(그리드와 십자선만) — 앱에서는 MJPEG 스트림이 들어온다

[`0.0.1`](../0.0.1/) 은 부품 단위 검수용 예전 세트다. 이 세트로 대체되면 지운다.
