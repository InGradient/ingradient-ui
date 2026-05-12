# Phase 8 — Fixture/Scenario Selector + Page Controls

**상위 문서**: [storybook_architecture_restructure.md § 15, § 16](../storybook_architecture_restructure.md)
**위험도**: 낮음 (helper 추가 + stories 갱신)
**선행 조건**: Phase 7
**후속 단계**: Phase 9 (Pages 실구현 — catalog/training/analytics/settings)

---

## 1. 목적

각 page story 가 실제 발생 가능한 상태 (Empty / Loading / Error / Permission Denied / LongText / ManyItems / ...) 를 selector 로 전환 가능하게 한다. § 16.1.

추가로 § 15.3 의 Page Controls (viewMode / sidebar / rightPanel / filterStyle 등) 를 표준 args 로 노출.

## 2. 설계

### 2.1 Scenario type 정의

공통 scenario (§ 16.2) 는 모든 page 에 공통으로 노출:
```ts
type CommonScenario = 'default' | 'empty' | 'loading' | 'error' | 'permission-denied' | 'long-text' | 'many-items'
```

페이지마다 자기 도메인 scenario 를 union 으로 확장 (§ 16.3-16.6):
```ts
type CatalogScenario = CommonScenario | 'huge-dataset' | 'syncing' | 'multi-selection' | 'export-ready'
type TrainingScenario = CommonScenario | 'queued' | 'running' | 'paused' | 'no-gpu'
type EdgeScenario = CommonScenario | 'camera-disconnected' | 'offline' | 'capturing' | 'license-expired'
type MedicalScenario = CommonScenario | 'dicom-loading' | 'segmentation-missing' | 'viewer-error'
```

### 2.2 Fixture pattern

각 fixture 모듈이 `scenario` 별 데이터 노출:
```ts
// fixtures/edge/0.0.1/scenarios.ts
export const edgeScenarios = {
  default: { devices: mockDevices, datasets: mockDatasets, license: mockLicense },
  empty: { devices: [], datasets: [], license: mockLicense },
  'camera-disconnected': { devices: mockDevices.map(d => ({...d, status: 'offline'})), ... },
  ...
}
```

### 2.3 Helper

`stories/support/scenarios.ts`:
- `commonScenarios: CommonScenario[]`
- `scenarioArgType(extra?: string[])` — argType 생성 helper

### 2.4 Story 적용 패턴

```ts
const meta = {
  argTypes: {
    scenario: scenarioArgType(['huge-dataset', 'syncing', ...]),
    viewMode: { control: 'select', options: ['table', 'grid'] },
    sidebar: { control: 'select', options: ['expanded', 'compact', 'hidden'] },
    ...
  },
  args: { scenario: 'default', viewMode: 'grid', sidebar: 'expanded' },
}

function PageScene({ scenario, viewMode, sidebar, ... }) {
  const data = catalogScenarios[scenario]
  return <CatalogView data={data} viewMode={viewMode} sidebar={sidebar} />
}
```

기존 `export const Default: Story = ...` 같은 named variant 도 유지 (특정 시나리오 빠른 진입용).

## 3. 작업 체크리스트

### 3.1 Scenario helper
- [ ] `stories/support/scenarios.ts` — type + commonScenarios + scenarioArgType helper

### 3.2 Fixture scenarios 추가
- [ ] `stories/fixtures/platform/0.0.1/scenarios.ts` — auth scenarios (Login/Signup 용)
- [ ] `stories/fixtures/edge/0.0.1/scenarios.ts` — login/license/datasetSelect 용 scenario set
- [ ] `stories/fixtures/medical/0.0.1/scenarios.ts` — auth/projectPicker/classWorkspace 용

### 3.3 기존 stories 갱신 (예시)
- [ ] platform Login.stories — `scenario` arg 추가 (Default/ValidationError/Submitting 가 그대로 매핑)
- [ ] edge Login.stories — `scenario` arg
- [ ] medical Auth.stories — `scenario` arg

(나머지 stories 는 Phase 9 의 페이지 실구현 시 함께 적용)

### 3.4 Page Controls (§ 15.3) 표준 이름 합의
- [ ] `stories/support/page-controls.ts` — viewMode/sidebar/rightPanel/filterStyle/tableDensity/selectionMode 의 control 정의 export
- [ ] Login/Auth 같은 단순 페이지에는 적용 불필요 (해당 control 없음). 본격 적용은 Phase 9 의 catalog/training 등.

## 4. 검증
- [ ] typecheck 통과
- [ ] 기존 named variant (Default/ValidationError 등) Storybook 에서 그대로 노출
- [ ] story 의 `scenario` control 에서 옵션 변경 시 화면 전환
- [ ] Page Controls 예시 (viewMode 등) 가 argTypes 에 추가됐을 때 정상 작동

## 5. 산출물
- `stories/support/scenarios.ts` (helper + type)
- `stories/support/page-controls.ts` (control 정의 표준)
- 각 service 의 `fixtures/.../scenarios.ts`
- 갱신된 Login/Signup/Auth stories (예시)
- 본 plan 문서

## 6. 제외 (다음 phase)
- catalog/training/analytics/settings 같은 본격 page 구현 — Phase 9
- Scenario Matrix 자동 검증 (Visual regression 등) — V1+
