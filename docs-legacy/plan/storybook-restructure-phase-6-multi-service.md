# Phase 6 — Multi-Service 확장 (Edge / Medical)

**상위 문서**: [storybook_architecture_restructure.md](../storybook_architecture_restructure.md)
**위험도**: 낮음 (이미 검증된 구조의 복제 + 서비스 고유 콘텐츠 추가)
**선행 조건**: Phase 4 완료 (preset 시스템 작동). Phase 5 권장 (builders 로 효율적 작성).
**후속 단계**: 본 phase 완료 후 — 정기적 버전 snapshot (platform/0.1.0 등) 추가는 운영 작업으로.

---

## 1. 목적

`platform` 외 두 서비스(`edge`, `medical`) 에 대해 동일한 구조의 첫 snapshot 을 만든다.

- `stories/pages/edge/0.0.1/` — Edge 서비스 첫 페이지
- `stories/pages/medical/0.0.1/` — Medical 서비스 첫 페이지
- 각각의 fixtures, sandboxes, preset

---

## 2. 사전 정보 수집 (Step 6.1)

각 서비스의 실제 코드/디자인 확인 필요:

- [ ] **Edge** — `ingradient-edge/` 의 페이지 인벤토리 (capture, deflectometry, device 관리 등 주요 화면)
- [ ] **Medical** — `medilabel/` 의 페이지 인벤토리 (labeling, review 등)
- [ ] 각 서비스의 디자인 토큰 차이 분석 (특히 medical 은 light theme 가능성)
- [ ] 각 서비스 첫 버전에 포함할 페이지 우선순위 선정 (서비스당 3~5개 권장)

산출물: `docs/plan/storybook-restructure-phase-6-inventory.md` (서비스별 페이지 목록).

---

## 3. Edge — `0.0.1`

### 3.1 Preset
- [ ] `src/tokens/presets/edge/0.0.1/preset.ts` — `{ theme: 'industrial-dark', brand: 'default', density: 'compact', mode: 'dark' }` (platform 과 유사 가정 — 실제 디자인 차이 반영)
- [ ] `src/tokens/presets/edge/index.ts`

### 3.2 Pages (Step 6.1 인벤토리 후 확정)
예시 (실제 인벤토리 후 조정):
- [ ] `stories/pages/edge/0.0.1/CaptureLive.stories.tsx` — 캡처 라이브 뷰
- [ ] `stories/pages/edge/0.0.1/DeviceList.stories.tsx` — 디바이스 리스트
- [ ] `stories/pages/edge/0.0.1/CaptureSettings.stories.tsx` — 캡처 설정
- [ ] `stories/pages/edge/0.0.1/index.ts`

### 3.3 Fixtures
- [ ] `stories/fixtures/edge/0.0.1/devices.ts`
- [ ] `stories/fixtures/edge/0.0.1/captures.ts`
- [ ] `stories/fixtures/edge/0.0.1/preset.ts` — Edge preset re-export
- [ ] `stories/fixtures/edge/0.0.1/index.ts`

### 3.4 Sandbox
- [ ] `stories/sandboxes/edge/<name>.stories.tsx` — Edge 실험 1~2개 (선택)

---

## 4. Medical — `0.0.1`

### 4.1 Preset
- [ ] `src/tokens/presets/medical/0.0.1/preset.ts` — `theme: 'medical'`, `mode: 'light'` (가정, 인벤토리 후 조정)
- [ ] `src/tokens/presets/medical/index.ts`

### 4.2 Pages (Step 6.1 인벤토리 후 확정)
예시:
- [ ] `stories/pages/medical/0.0.1/LabelingWorkspace.stories.tsx`
- [ ] `stories/pages/medical/0.0.1/CaseList.stories.tsx`
- [ ] `stories/pages/medical/0.0.1/ReviewPage.stories.tsx`
- [ ] `stories/pages/medical/0.0.1/index.ts`

### 4.3 Fixtures
- [ ] `stories/fixtures/medical/0.0.1/cases.ts`
- [ ] `stories/fixtures/medical/0.0.1/annotations.ts`
- [ ] `stories/fixtures/medical/0.0.1/preset.ts`
- [ ] `stories/fixtures/medical/0.0.1/index.ts`

---

## 5. Gap 처리

각 서비스의 페이지에서 ui-library 에 없는 컴포넌트가 발견되면:
1. Platform 의 [storybook_mockup_ui_gaps.md](../../../ingradient-platform/docs/plans/storybook_mockup_ui_gaps.md) 패턴 따라 검증
2. 진짜 새 컴포넌트 / prop 확장 필요 시 ui-library 추가
3. 1곳 사용 + 단순 시각이면 platform/edge/medical 안에 유지

---

## 6. Storybook 토글

- [ ] `.storybook/preview.ts` 의 preset selector 에 edge, medical 옵션 추가
- [ ] toolbar 에서 서비스 전환 시 모든 story 가 해당 preset 으로 렌더

---

## 7. 검증 기준

- [ ] 3개 서비스 × 0.0.1 의 페이지/fixture/preset 모두 존재
- [ ] Storybook 사이드바에 `pages/{platform,edge,medical}/0.0.1/` 모두 노출
- [ ] preset toolbar 에서 서비스 전환 동작
- [ ] 각 서비스 페이지가 자체 preset 으로 시각적으로 구분됨 (medical 은 light, edge/platform 은 dark 등)

---

## 8. 산출물

- 서비스 2개의 preset
- 서비스당 3~5개 페이지 story (총 6~10개)
- 서비스당 fixtures 모듈
- 인벤토리 문서 1개

---

## 9. 후속 (Phase 7+ — 운영)

- platform 0.1.0 등 다음 버전 snapshot 작성 (UI 진화 history 보존)
- 디자이너의 builder 기반 실험 → sandbox 승격 → pages 승격 흐름 정착
- brand override 실제 값 채우기 (finemtech, samsung 등 고객사 디자인 적용)
- changelog / release notes 의 시각적 diff (버전간 페이지 비교)
